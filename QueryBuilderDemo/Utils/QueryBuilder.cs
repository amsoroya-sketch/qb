using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using PbsApi.Utils.Model;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using System.Reflection;

namespace PbsApi.Utils
{
  public static class QueryBuilder
  {
    /// <summary>
    /// Builds an EF Core query with dynamic includes based on navigation paths.
    /// </summary>
    public static IQueryable<T> BuildQuery<T>(this IQueryable<T> query, HashSet<string> includes) where T : class
    {
      foreach (var includePath in includes)
      {
        if (includePath == null) continue;

        var pathParts = includePath.Trim().Split('.');
        Type currentType = typeof(T);
        object currentQuery = query;
        PropertyInfo? parentPropertyInfo = null;
        for (int i = 0; i < pathParts.Length; i++)
        {
          var part = pathParts[i];
          var propertyInfo = currentType.GetProperty(part, BindingFlags.Public | BindingFlags.Instance);
          if (propertyInfo == null || IsScalar(propertyInfo)) continue;

          var targetType = GetEnumerableType(propertyInfo.PropertyType) ?? propertyInfo.PropertyType;
          if (i == 0)
          {
            currentQuery = ApplyInclude((IQueryable)currentQuery, currentType, propertyInfo);
          }
          else if (parentPropertyInfo != null)
          {
            currentQuery = ApplyThenInclude((IQueryable)currentQuery, parentPropertyInfo, currentType, propertyInfo);
          }
          //how to fetch previous property name from previous lambda.
          currentType = targetType;
          parentPropertyInfo = propertyInfo;
        }
        query = (IQueryable<T>)currentQuery;
      }

      return query;
    }

    /// <summary>
    /// Applies filtering based on custom [Where] attributes on properties or types.
    /// </summary>
    private static Expression ApplyWhereFilter(Expression queryExpr, Type elementType, ParameterExpression parameter, PropertyInfo propertyInfo)
    {
      var filterExpression = propertyInfo.GetCustomAttribute<WhereAttribute>()?.Expression
                             ?? elementType.GetCustomAttribute<WhereAttribute>()?.Expression;

      if (string.IsNullOrEmpty(filterExpression)) return queryExpr;

      var filterPredicate = DynamicExpressionParser.ParseLambda(parameter.Type, typeof(bool), filterExpression);
      return Expression.Call(
          typeof(Enumerable),
          "Where",
          new[] { elementType },
          queryExpr,
          filterPredicate
      );
    }

    private static Expression ApplyOrderByAttributes(Expression queryExpr, Type elementType, ParameterExpression parameter, PropertyInfo propertyInfo)
    {
      // Only apply ordering to collection properties
      if (IsScalar(propertyInfo))
        return queryExpr;

      var orderAttrs = propertyInfo.GetCustomAttributes<DLINQOrderbyAttribute>()?.ToList()
          ?? new List<DLINQOrderbyAttribute>();
      orderAttrs.AddRange(elementType.GetCustomAttributes<DLINQOrderbyAttribute>());

      if (!orderAttrs.Any()) return queryExpr;

      // Check if the expression type is a collection
      // If not a collection, skip ordering to prevent Expression.Call errors
      if (GetEnumerableType(queryExpr.Type) == null)
        return queryExpr;

      bool isFirst = true;
      foreach (var attr in orderAttrs)
      {
        var subPropertyExpression = Expression.Property(parameter, attr.PropertyName);
        var subPropertyLambdaExpression = Expression.Lambda(Expression.Convert(subPropertyExpression, typeof(object)), parameter);
        var methodName = isFirst
            ? (attr.Descending ? "OrderByDescending" : "OrderBy")
            : (attr.Descending ? "ThenByDescending" : "ThenBy");

        queryExpr = Expression.Call(
            typeof(Enumerable),
            methodName,
            new[] { elementType, typeof(object) },
            queryExpr,
            subPropertyLambdaExpression
        );

        isFirst = false;
      }

      return queryExpr;
    }

    private static IQueryable ApplyInclude(IQueryable query, Type queryEntityType, PropertyInfo relatedPropInfo)
    {
      if (relatedPropInfo == null || IsScalar(relatedPropInfo))
        return query;

      var queryEntityParam = Expression.Parameter(queryEntityType, "x"); //removed collection from type if any 
      var propertyAccess = Expression.Property(queryEntityParam, relatedPropInfo.Name);
      
      var actualTypeOfRelatedProp = GetEnumerableType(relatedPropInfo.PropertyType) ?? relatedPropInfo.PropertyType;
      var relatedPropParam = Expression.Parameter(actualTypeOfRelatedProp, "y");

      Expression queryExpr = ApplyWhereFilter(propertyAccess, actualTypeOfRelatedProp, relatedPropParam, relatedPropInfo);
      queryExpr = ApplyOrderByAttributes(queryExpr, actualTypeOfRelatedProp, relatedPropParam, relatedPropInfo);

      var entityParam = Expression.Parameter(query.ElementType, "x");
      var lambda = Expression.Lambda(queryExpr, entityParam);

      var methodFiltered = typeof(EntityFrameworkQueryableExtensions)
          .GetMethods()
          .First(m => m.Name == "Include" && m.GetParameters().Length == 2)
          .MakeGenericMethod(query.ElementType, lambda.Body.Type);

      return (IQueryable)methodFiltered.Invoke(null, new object[] { query, lambda })!;
    }

    /// <summary>
    /// Gets the appropriate EF Core ThenInclude method based on type relationships.
    /// </summary>
    public static MethodInfo? GetThenIncludeMethod(Type entityType, Type previousType, Type nextType)
    {
      bool IsCollection(Type type) =>
          type != typeof(string) && typeof(IEnumerable).IsAssignableFrom(type);

      bool previousIsCollection = IsCollection(previousType);

      var methods = typeof(EntityFrameworkQueryableExtensions)
          .GetMethods()
          .Where(m => m.Name == "ThenInclude" && m.IsGenericMethodDefinition)
          .ToList();

      foreach (var method in methods)
      {
        var parameters = method.GetParameters();
        if (parameters.Length != 2)
          continue;

        var firstParamType = parameters[0].ParameterType;
        var secondParamType = parameters[1].ParameterType;

        var genericArgs = method.GetGenericArguments();
        if (genericArgs.Length != 3)
          continue;

        // Match based on whether previousType is a collection
        if (previousIsCollection)
        {
          if (firstParamType.IsGenericType &&
              firstParamType.GetGenericTypeDefinition() == typeof(IIncludableQueryable<,>) &&
              firstParamType.GetGenericArguments()[1].IsGenericType &&
              firstParamType.GetGenericArguments()[1].GetGenericTypeDefinition() == typeof(IEnumerable<>))
          {
            var enumType = GetEnumerableType(previousType);
            if (enumType != null)
              return method.MakeGenericMethod(entityType, enumType, nextType);
          }
        }
        else
        {
          if (firstParamType.IsGenericType &&
              firstParamType.GetGenericTypeDefinition() == typeof(IIncludableQueryable<,>) &&
              !firstParamType.GetGenericArguments()[1].IsGenericType)
          {
            return method.MakeGenericMethod(entityType, previousType, nextType);
          }
        }
      }

      return null;
    }

    /// <summary>
    /// Applies EF Core ThenInclude with optional filtering and ordering.
    /// </summary>
    private static IQueryable ApplyThenInclude(IQueryable query, PropertyInfo parentPropertyInfo, Type queryEntityType, PropertyInfo relatedPropInfo)
    {
      if (relatedPropInfo == null || IsScalar(relatedPropInfo))
        return query;

      var queryEntityParam = Expression.Parameter(queryEntityType, "x");
      var propertyAccess = Expression.Property(queryEntityParam, relatedPropInfo.Name);
      var actualTypeOfRelatedProp = GetEnumerableType(relatedPropInfo.PropertyType) ?? relatedPropInfo.PropertyType;
      var relatedPropParam = Expression.Parameter(actualTypeOfRelatedProp, "y");

      Expression queryExpr = ApplyWhereFilter(propertyAccess, actualTypeOfRelatedProp, relatedPropParam, relatedPropInfo);
      queryExpr = ApplyOrderByAttributes(queryExpr, actualTypeOfRelatedProp, relatedPropParam, relatedPropInfo);

      // Use queryEntityParam instead of query.ElementType
      var lambda = Expression.Lambda(queryExpr, queryEntityParam);

      var method = GetThenIncludeMethod(query.ElementType, parentPropertyInfo.PropertyType, lambda.Body.Type);
      if (method == null)
        return query;

      return (IQueryable)method.Invoke(null, new object[] { query, lambda })!;
    }

    /// <summary>
    /// Gets the element type from an IEnumerable type.
    /// </summary>
    private static Type? GetEnumerableType(Type type)
    {
      if (type.IsGenericType && typeof(IEnumerable<>).IsAssignableFrom(type.GetGenericTypeDefinition()))
      {
        return type.GetGenericArguments()[0];
      }

      var iface = type.GetInterfaces()
          .FirstOrDefault(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IEnumerable<>));

      return iface?.GetGenericArguments()[0];
    }

    /// <summary>
    /// Expands entity/collection references to their scalar fields.
    /// Example: "Departments.Employees" → ["Departments.Employees.Id", "Departments.Employees.FirstName", ...]
    /// </summary>
    public static List<string> ExpandFieldsToScalars(List<string> selectFields, Type rootEntityType)
    {
      var expandedFields = new List<string>();

      foreach (var field in selectFields)
      {
        if (string.IsNullOrWhiteSpace(field)) continue;

        // Navigate to the target type
        var parts = field.Split('.');
        var currentType = rootEntityType;

        for (int i = 0; i < parts.Length; i++)
        {
          var part = parts[i];
          var prop = currentType.GetProperty(part, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);

          if (prop == null)
          {
            // Property not found, add as-is
            expandedFields.Add(field);
            break;
          }

          // Check if this is the last part
          if (i == parts.Length - 1)
          {
            // Last part - check if it's a scalar or entity/collection
            if (IsScalar(prop))
            {
              // Already scalar, add as-is
              expandedFields.Add(field);
            }
            else
            {
              // Entity or collection - expand to all scalar fields
              var targetType = GetEnumerableType(prop.PropertyType) ?? prop.PropertyType;
              var scalarFields = GetAllScalarFields(targetType, field);
              expandedFields.AddRange(scalarFields);
            }
          }
          else
          {
            // Intermediate part - move to next level
            currentType = GetEnumerableType(prop.PropertyType) ?? prop.PropertyType;
          }
        }
      }

      return expandedFields.Distinct().ToList();
    }

    /// <summary>
    /// Recursively gets all scalar field paths for a given type, expanding nested entities to their leaf nodes.
    /// Example: Employee → ["Id", "FirstName", "LastName", "Email", "DepartmentId", "RoleId",
    ///                       "Department.Id", "Department.Name", "Department.Budget", "Department.Head", "Department.OrganisationId",
    ///                       "Role.Id", "Role.Title", ...]
    /// </summary>
    private static List<string> GetAllScalarFields(Type type, string basePath = "", HashSet<Type>? visitedTypes = null)
    {
      var scalarFields = new List<string>();

      // Initialize visited types on first call to prevent circular references
      if (visitedTypes == null)
      {
        visitedTypes = new HashSet<Type>();
      }

      // Prevent infinite recursion from circular references
      if (visitedTypes.Contains(type))
      {
        return scalarFields;
      }

      visitedTypes.Add(type);

      foreach (var prop in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
      {
        var fieldPath = string.IsNullOrEmpty(basePath) ? prop.Name : $"{basePath}.{prop.Name}";

        if (IsScalar(prop))
        {
          // Direct scalar property - add it
          scalarFields.Add(fieldPath);
        }
        else if (IsCollectionType(prop.PropertyType, out var elementType))
        {
          // Collection property - skip it (don't expand collections recursively)
          // Collections should be explicitly specified by the user
          continue;
        }
        else
        {
          // Entity reference (non-scalar, non-collection) - recursively expand to leaf nodes
          var nestedType = prop.PropertyType;

          // Create a new visited set for this branch to allow the same type in different paths
          var branchVisitedTypes = new HashSet<Type>(visitedTypes);
          var nestedFields = GetAllScalarFields(nestedType, fieldPath, branchVisitedTypes);
          scalarFields.AddRange(nestedFields);
        }
      }

      return scalarFields;
    }

    public static IQueryable BuildFlattenedQuery(IQueryable query, Type entityType, List<string> selectFields)
    {
      // Preprocess: expand any entity/collection references to their scalar fields
      // Example: "Departments.Employees" → ["Departments.Employees.Id", "Departments.Employees.FirstName", ...]
      selectFields = ExpandFieldsToScalars(selectFields, entityType);

      var collectionLevels = FindAllCollectionLevels(selectFields, entityType);

      if (collectionLevels.Count == 0)
      {
        var regularSelectString = BuildSelectString(selectFields);
        return query.Select($"new ({regularSelectString})");
      }

      IQueryable flattenedQuery = query;
      Type currentSourceType = entityType;
      var contextStructure = new List<CollectionContext>();

      for (int i = 0; i < collectionLevels.Count; i++)
      {
        var collectionPath = collectionLevels[i];

        // IMPORTANT: resolve collection info against the ROOT entity type,
        // not the evolving OuterInner<> type
        var collectionInfo = GetCollectionPropertyInfo(entityType, collectionPath, contextStructure);

        flattenedQuery = ApplySelectManyWithExpressionTree(flattenedQuery, currentSourceType, collectionInfo, contextStructure);

        contextStructure.Add(new CollectionContext
        {
          Path = collectionPath,
          CollectionType = collectionInfo.ElementType,
          Level = i
        });

        // The source type evolves (OuterInner<...>) after each SelectMany
        currentSourceType = flattenedQuery.ElementType;
      }

      var projectionParts = BuildProjectionWithContextStructure(selectFields, contextStructure);
      var projectionString = string.Join(", ", projectionParts);

      // Apply Distinct to eliminate duplicate rows from cartesian products (SelectMany operations)
      // This happens on the database side before materialization
      return flattenedQuery.Select($"new ({projectionString})").Distinct();
    }

    private static List<string> BuildProjectionWithContextStructure(List<string> selectFeilds, List<CollectionContext> contextStructure)
    {
      var projectionParts = new List<string>();
      var totalLevels = contextStructure.Count;
      foreach (var fields in selectFeilds)
      {
        var alias = fields.Replace(".", "_");
        string projectionPath = MapFieldToNestedContext(fields, contextStructure, totalLevels);
        projectionParts.Add($"{projectionPath} as {alias}");

      }
      return projectionParts;
    }


    private static string MapFieldToNestedContext(string fieldPath, List<CollectionContext> contextStructure, int totalLevels)
    {
      //Find which collection level this field belongs to

      int belongsToLevel = -1; // means root entity
      for (int i = contextStructure
        .Count - 1; i >= 0; i--)
      {
        if (fieldPath.StartsWith(contextStructure[i].Path + "." ))
        {
          belongsToLevel = i;
          break;
        }
      }


      if (belongsToLevel == -1)
      {
        if (totalLevels == 0)
        {
          return fieldPath;
        }
        else
        {
          var outerChain = string.Join(".", Enumerable.Repeat("Outer", totalLevels));
          return $"{outerChain}.{fieldPath}";
        }
      }
      else
      {
        var remainingPath = fieldPath.Substring(contextStructure[belongsToLevel].Path.Length + 1);
        if (belongsToLevel == totalLevels -1)
        {
          return $"Inner.{remainingPath}";
        }
        else
        {
          var levelsDepper = totalLevels - belongsToLevel - 1;
          var outerChain = string.Join(".", Enumerable.Repeat("Outer", levelsDepper));
          return $"{outerChain}.Inner.{remainingPath}";
        }
      }
    }

    private static IQueryable ApplySelectManyWithExpressionTree(
      IQueryable query,
      Type sourceType,
      CollectionPropertyInfo collectionInfo,
      List<CollectionContext> existingContext)
    {
      // Build query.SelectManay(x => x.Navigation.Collection, (outer, inner) => new { Outer = outer, Inner = inner})

      var outerParam = Expression.Parameter(sourceType, "outer");
      Expression collectionAccess;
      if (existingContext.Count == 0)
      {
        //
        collectionAccess = Expression.Property(outerParam, collectionInfo.Property);
      }
      else
      {
        //Sibling to the correct level based on common ancestor depth
        Expression targetExpression;
        if (collectionInfo.CommonAncestorDepth == 0)
        {

          //Sibling of root-level colleciton - navigate back to root through Outer chain
          //Structure : {Outer: ..., I
          targetExpression = outerParam;
          for (int i = 0; i < existingContext.Count; i++)
          {
            {

              var outerProperty = targetExpression.Type.GetProperty("Outer");
              if (outerProperty == null)
                throw new InvalidOperationException($"Property 'Outer' not found on type {targetExpression.Type.Name}");
              targetExpression = Expression.Property(targetExpression, outerProperty);
            }
          }
        }
        else if (collectionInfo.CommonAncestorDepth == existingContext.Count)
        {
          var innerProperty = sourceType.GetProperty("Inner");
          if (innerProperty == null)
            throw new InvalidOperationException($"Property 'Inner' not found on type {sourceType.Name}");
          targetExpression = Expression.Property(outerParam, innerProperty);
        } 
        else
        {

          //Sibling of intermediate collection - navigate back to common ancestor
          //Go back through Outer chain (existingContext.Count - commonDepth) times
          // Then access Inner to get the collection at commonDepth - 1

          targetExpression = outerParam;
          int stepsBack = existingContext.Count - collectionInfo.CommonAncestorDepth;
          for (int i = 0; i < stepsBack; i++)
          {
            var outerProperty = targetExpression.Type.GetProperty("Outer");
            if (outerProperty == null)
              throw new InvalidOperationException($"Property 'Outer' not found on type {targetExpression.Type.Name}");
            targetExpression = Expression.Property(targetExpression, outerProperty);
          }
          // Now at the level containing the common ancestor
          // Access Inner to get the collection elelment at commonDepth -1

          var innerProperty = targetExpression.Type.GetProperty("Inner");
          if (innerProperty == null)
            throw new InvalidOperationException($"Property 'Inner' not found on type {targetExpression.Type.Name}");
          targetExpression = Expression.Property(targetExpression, innerProperty);
        }
        collectionAccess = Expression.Property(targetExpression, collectionInfo.Property);
      }

      // create lambda with correct type signature
      var enumerableType = typeof(IEnumerable<>).MakeGenericType(collectionInfo.ElementType);
      var collectionSelectorType = typeof(Func<,>).MakeGenericType(sourceType, enumerableType);
      var collectionSelector = Expression.Lambda(collectionSelectorType, collectionAccess, outerParam);

      var innerParam = Expression.Parameter(collectionInfo.ElementType, "inner");


      //create anonymous type constructor
      var anonType = new { Outer = default(object), Inner = default(object) }.GetType().GetGenericTypeDefinition();
      var resultType = anonType.MakeGenericType(sourceType, collectionInfo.ElementType);

      var constructor = resultType.GetConstructors()[0];
      var outerProp = resultType.GetProperty("Outer")!;
      var innerProp2 = resultType.GetProperty("Inner")!;

      var newExpression = Expression.New(
        constructor,
        new Expression[] {outerParam, innerParam},
        outerProp, innerProp2
      );

      var resultSelectorType = typeof(Func<,,>).MakeGenericType(sourceType, collectionInfo.ElementType, resultType);
      var resultSelector = Expression.Lambda(resultSelectorType, newExpression, outerParam, innerParam);
      
      var selectManyMethod = typeof(Queryable).GetMethods()
        .Where(m => m.Name == "SelectMany")
        .Where(m => m.IsGenericMethodDefinition)
        .Where(m => m.GetGenericArguments().Length == 3)
        .Where(m => m.GetParameters().Length == 3)
        .Where(m =>
        {
          var params_ = m.GetParameters();
          var collectionSelectorType = params_[1].ParameterType;
          if (collectionSelectorType.IsGenericType)
          {
            var funcType = collectionSelectorType.GetGenericArguments()[0];
            if (funcType.IsGenericType)
            {
              var funcArgs = funcType.GetGenericArguments();
              return funcArgs.Length == 2; // Non indexed version
            }
          }
          return false;
        })
        .First()
        .MakeGenericMethod(sourceType, collectionInfo.ElementType, resultType);

      return (IQueryable)selectManyMethod.Invoke(null, new object[] {query, collectionSelector, resultSelector })!;
    }

    private static CollectionPropertyInfo GetCollectionPropertyInfo(
    Type rootType, string collectionPath, List<CollectionContext> existingContext)
    {
      var pathParts = collectionPath.Split('.');

      if (existingContext.Count == 0)
      {
        var propertyName = pathParts[0];
        var prop = rootType.GetProperty(propertyName);
        if (prop == null)
          throw new InvalidOperationException($"Property '{propertyName}' not found on type '{rootType.Name}'");

        var elemType = GetEnumerableType(prop.PropertyType);
        if (elemType == null)
          throw new InvalidOperationException($"Property '{propertyName}' is not a collection on type '{rootType.Name}'");

        return new CollectionPropertyInfo
        {
          Property = prop,
          ElementType = elemType,
          NavigationPath = propertyName,
          CommonAncestorDepth = 0
        };
      }
      else
      {
        var lastContextPath = existingContext[^1].Path;
        var lastContextParts = lastContextPath.Split('.');

        int commonDepth = 0;
        for (int i = 0; i < Math.Min(pathParts.Length - 1, lastContextParts.Length); i++)
        {
          if (pathParts[i] == lastContextParts[i])
            commonDepth++;
          else
            break;
        }

        var propertyName = pathParts[commonDepth];

        // When commonDepth == 0, we are sibling to a root-level collection:
        // resolve starting from the ROOT type, not the current OuterInner<> source.
        Type currentType = (commonDepth == 0)
            ? rootType
            : existingContext[commonDepth - 1].CollectionType;

        var prop = currentType.GetProperty(propertyName);
        if (prop == null)
          throw new InvalidOperationException($"Property '{propertyName}' not found on type {currentType.Name}");

        var elemType = GetEnumerableType(prop.PropertyType);
        if (elemType == null)
          throw new InvalidOperationException($"Property '{propertyName}' is not a collection on type {currentType.Name}");

        return new CollectionPropertyInfo
        {
          Property = prop,
          ElementType = elemType,
          NavigationPath = propertyName,
          CommonAncestorDepth = commonDepth
        };
      }
    }

    private static string BuildSelectString(List<string> selectFields)
    {
      var parts = selectFields.Select(field =>
      {
        var alias = field.Replace(".", "_");
        return $"{field} as {alias}";
      });
      return string.Join(",", parts);
    }

    private static bool IsCollectionType(Type type, out Type? elementType)
    {
      elementType = null;
      if (type == typeof(string))
        return false;

      if (type.IsGenericType)
      {
        var genericDef = type.GetGenericTypeDefinition();
        if (genericDef == typeof(ICollection<>) ||
           genericDef == typeof(IEnumerable<>) ||
          genericDef == typeof(IList<>) ||
          genericDef == typeof(List<>))
        {
          elementType = type.GetGenericArguments().First();
          return true;
        }
      }
      return false;
    }


    private static List<string> FindAllCollectionLevels(List<string> selectFields, Type entityType)
    {
      var collections = new HashSet<string>();

      foreach (var field in selectFields)
      {
        if (!field.Contains('.'))
          continue;

        var parts = field.Split('.');
        var currentType = entityType;
        var currentPath = "";
        for (int i = 0; i < parts.Length - 1; i++)
        {
          var propName = parts[i];
          currentPath = string.IsNullOrEmpty(currentPath) ? propName : $"{currentPath}.{propName}";

          var propertyInfo = currentType.GetProperty(propName);
          if (propertyInfo == null)
            break;

          var propertyType = propertyInfo.PropertyType;

          if (IsCollectionType(propertyType, out var elementType))
          {
            collections.Add(currentPath);
            if (elementType != null)
              currentType = elementType;
            else
              break;

          }
          else
          {
            currentType = propertyType;
          }
        }
      }
      //sorting by path length shallowest first
      return collections.OrderBy(c => c.Count(ch => ch == '.')).ThenBy(c => c).ToList();
    }



    private static bool HasCollectionNavigations(Type entityType, List<string> selectFields)
    {

      foreach (var field in selectFields)
      {
        if (!field.Contains('.'))
          continue;

        var parts = field.Split('.');
        var currentTye = entityType;
        for (int i = 0; i < parts.Length - 1; i++)
        {
          var propertyInfo = entityType.GetProperty(parts[i]);
          if (propertyInfo == null)
            break;

          var propertyType = propertyInfo.PropertyType;

          if (propertyType.IsGenericType && (
            propertyType.GetGenericTypeDefinition() == typeof(ICollection<>) ||
            propertyType.GetGenericTypeDefinition() == typeof(IEnumerable<>) ||
            propertyType.GetGenericTypeDefinition() == typeof(List<>)))
          {
            return true;
          }

          if (propertyType.IsGenericType)
          {
            currentTye = propertyType.GetGenericArguments()[0];
          }
          else
          {
            currentTye = propertyType;
          }
        }
      }
      return false;

    }


    /// <summary>
    /// Splits include paths into valid EF Core includes and selector paths for projection.
    /// </summary>
    public static void SplitIncludes<TEntity>(
     HashSet<string> includes,
     out HashSet<string> validIncludes,
     out HashSet<string> selectorPaths)
    {
      validIncludes = new HashSet<string>();
      selectorPaths = new HashSet<string>();
      var entityType = typeof(TEntity);
      var processedRootPaths = new HashSet<string>();
      foreach (var path in includes)
      {
        if (string.IsNullOrWhiteSpace(path)) continue;

        if (path == "*")
        {
          PopulatePathsRecursively(string.Empty, entityType, validIncludes, selectorPaths, processedRootPaths, new HashSet<Type>());
          continue;
        }

        if (path.EndsWith(".*"))
        {
          var basePath = path.Substring(0, path.Length - 2);
          var baseType = GetNestedType(entityType, basePath);
          if (baseType != null)
          {
            if (!string.IsNullOrEmpty(basePath))
            {
              var baseParts = basePath.Split('.');
              var currentNavPath = "";
              Type currentType = entityType;
              for (int i = 0; i < baseParts.Length; i++)
              {
                var part = baseParts[i];
                var prop = currentType.GetProperty(part, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                if (prop == null) break;
                part = prop.Name;
                currentNavPath = string.IsNullOrEmpty(currentNavPath) ? part : $"{currentNavPath}.{part}";
                if (!IsScalar(prop))
                {
                  validIncludes.Add(currentNavPath);
                }
                currentType = prop.PropertyType.IsGenericType
                    ? (prop.PropertyType.GetGenericArguments().FirstOrDefault() ?? prop.PropertyType)
                    : prop.PropertyType;
              }
            }
            PopulatePathsRecursively(basePath, baseType, validIncludes, selectorPaths, processedRootPaths, new HashSet<Type>());
          }
          continue;
        }

        var parts = path.Split('.').Select(p => p.Trim()).ToArray();
        var type = entityType;
        var currentPath = "";
        bool isNavigationPropertyPath = false;

        for (int i = 0; i < parts.Length; i++)
        {
          var part = parts[i];
          var prop = type.GetProperty(part, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
          if (prop == null) break;
          part = prop.Name;
          currentPath = string.IsNullOrEmpty(currentPath) ? part : $"{currentPath}.{part}";
          if (!IsScalar(prop))
          {
            validIncludes.Add(currentPath);
            isNavigationPropertyPath = true;
          }
          else
          {
            isNavigationPropertyPath = false;
          }

          if (i == parts.Length - 1)
          {
            selectorPaths.Add(currentPath);
            if (isNavigationPropertyPath && !processedRootPaths.Contains(currentPath))
            {
              var nestedType = prop.PropertyType.IsGenericType
                  ? prop.PropertyType.GetGenericArguments().FirstOrDefault()
                  : prop.PropertyType;
              if (nestedType != null && nestedType != typeof(object))
              {
                PopulatePathsRecursively(currentPath, nestedType, validIncludes, selectorPaths, processedRootPaths, new HashSet<Type>());
              }
            }
          }
          type = prop.PropertyType.IsGenericType
              ? (prop.PropertyType.GetGenericArguments().FirstOrDefault() ?? prop.PropertyType)
              : prop.PropertyType;
        }
      }

      var originalIncludes = validIncludes.ToList();
      var originalSelectors = selectorPaths.ToList();

      validIncludes = new HashSet<string>(
          validIncludes.Where(path =>
              !originalIncludes.Any(other => other != path && other.StartsWith(path + "."))
          )
      );

      selectorPaths = new HashSet<string>(
          selectorPaths.Where(path => !originalSelectors.Any(other => other != path && other.StartsWith(path + "."))
        )
      ); 
      originalIncludes = null;
    }

    /// <summary>
    /// Recursively populates include and selector paths from a given type.
    /// </summary>
    private static void PopulatePathsRecursively(string currentPath, Type currentType,
                                                HashSet<string> includes, HashSet<string> selectors,
                                                HashSet<string> processedRootPaths, // Used to track paths where we've already done full recursion (e.g., from "Items.Product")
                                                HashSet<Type> visitedTypesInCurrentPath) // Tracks types encountered in the *current* recursion branch
    {
      if (visitedTypesInCurrentPath.Contains(currentType))
      {
        return;
      }

      visitedTypesInCurrentPath.Add(currentType);

      if (!string.IsNullOrEmpty(currentPath) && processedRootPaths.Contains(currentPath))
      {
        return;
      }

      if (!string.IsNullOrEmpty(currentPath))
      {
        processedRootPaths.Add(currentPath);
      }

      foreach (var prop in currentType.GetProperties(BindingFlags.Public | BindingFlags.Instance))
      {
        var fullPath = string.IsNullOrEmpty(currentPath) ? prop.Name : $"{currentPath}.{prop.Name}";

        if (!IsScalar(prop))
        {
          var nestedType = prop.PropertyType.IsGenericType
              ? prop.PropertyType.GetGenericArguments().FirstOrDefault()
              : prop.PropertyType;

          if (nestedType == null)
          {
            continue;
          }
          var recursiveIncludePath = getRecursiveIncludeString(currentType, fullPath, prop.Name);

          // Check if we should recurse:
          // - Always prevent cycles (visitedTypesInCurrentPath contains the type)
          // - If property has RecursiveIncludeLevel attribute, also check the level limit
          bool hasRecursiveAttr = prop.GetCustomAttributes(typeof(RecursiveIncludeLevelAttribute), true).Any();
          bool noCycle = nestedType != currentType && !visitedTypesInCurrentPath.Contains(nestedType);
          bool withinLevel = !hasRecursiveAttr || recursiveIncludePath;
          bool shouldRecurse = noCycle && withinLevel;

          if (nestedType != typeof(object) && shouldRecurse)
          {
            includes.Add(fullPath);
            selectors.Add(fullPath);
            var nextVisitedTypes = new HashSet<Type>(visitedTypesInCurrentPath);
            PopulatePathsRecursively(fullPath, nestedType, includes, selectors, processedRootPaths, nextVisitedTypes);
          }
        }
        else
        {
          selectors.Add(fullPath);
        }
      }
    }

    /// <summary>
    /// Determines whether a property should be recursively included based on [RecursiveIncludeLevel] attribute.
    /// </summary>
    public static bool getRecursiveIncludeString(Type currentType, string fullPath, string propName)
    {
      if (string.IsNullOrEmpty(propName))
        return false;

      var propInfo = currentType.GetProperty(propName);
      if (propInfo == null)
        return false;

      var attr = propInfo.GetCustomAttributes(typeof(RecursiveIncludeLevelAttribute), true)
                         .FirstOrDefault() as RecursiveIncludeLevelAttribute;

      if (attr == null)
        return true; // No attribute means no limit, allow recursion

      // Count the depth: number of segments in the NEXT path (fullPath + propName)
      int maxLevel = attr.Level;
      int currentDepth = string.IsNullOrEmpty(fullPath) ? 1 : fullPath.Split('.').Length + 1;

      return currentDepth <= maxLevel;
    }

    /// <summary>
    /// Fetch actual child element to iterate to next level.
    /// </summary>
    private static Type? UnwrapToNavigable(Type type)
    {
      // Unwrap Nullable<T>
      type = Nullable.GetUnderlyingType(type) ?? type;

      // Strings are scalar and not navigable
      if (type == typeof(string)) return null;

      // If it's a collection, navigate into its element type
      var elem = GetEnumerableType(type);
      if (elem != null) return elem;

      // If it's scalar, not navigable
      if (IsScalarType(type)) return null;

      // Otherwise navigate into the reference type itself
      return type;
    }

    /// <summary>
    /// Determines if a property is scalar (primitive, string, or value type).
    /// </summary>
    private static bool IsScalarType(Type type)
    {
      // Unwrap Nullable<T>
      type = Nullable.GetUnderlyingType(type) ?? type;

      if (type == typeof(string)) return true;
      if (type.IsEnum) return true;

      // Treat value types and primitives as scalar
      if (type.IsPrimitive || type.IsValueType) return true;

      // Collections: if element type is scalar, then treat the collection as scalar
      var elem = GetEnumerableType(type);
      if (elem != null)
      {
        return IsScalarType(elem); // recursive check for element type
      }

      return false;
    }

    private static bool IsScalar(PropertyInfo prop)
    {
      return IsScalarType(prop.PropertyType);
    }

    /// <summary>
    /// Gets the nested type from a dot-separated property path.
    /// </summary>
    private static Type? GetNestedType(Type rootType, string path)
    {
      var current = rootType;
      foreach (var part in path.Split('.'))
      {
        var prop = current.GetProperty(part, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
        if (prop == null) return null;
        current = prop.PropertyType.IsGenericType
            ? (prop.PropertyType.GetGenericArguments().FirstOrDefault() ?? prop.PropertyType)
            : prop.PropertyType;
      }
      return current;
    }

    /// <summary>
    /// Builds a selector expression to project only specified fields.
    /// </summary>
    public static Expression<Func<TEntity, TEntity>> BuildSelectorExpression<TEntity>(HashSet<string> selectorPaths)
    {
      var parameter = Expression.Parameter(typeof(TEntity), "e");
      var body = BuildMemberInit(typeof(TEntity), parameter, selectorPaths);
      return Expression.Lambda<Func<TEntity, TEntity>>(body, parameter);
    }

    /// <summary>
    /// Builds a query with dynamic includes and selector paths.
    /// </summary>
    public static IQueryable<TEntity> BuildDLINQQuery<TEntity>(
    IQueryable<TEntity> source,
    HashSet<string> fields)
    where TEntity : class
    {
      if (fields == null || fields.Count == 0)
        throw new ArgumentException("Fields must be provided.");
      SplitIncludes<TEntity>(fields, out var includes, out var selectorPaths);
      bool allScalar = selectorPaths.All(path =>
      {
        var type = typeof(TEntity);
        var parts = path.Split('.', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        PropertyInfo? prop = null;
        for (int i = 0; i < parts.Length; i++)
        {
          var part = parts[i];
          prop = type.GetProperty(part,
              BindingFlags.Public | BindingFlags.Instance |
              BindingFlags.IgnoreCase | BindingFlags.FlattenHierarchy);

          if (prop == null) return false;

          bool isLast = (i == parts.Length - 1);
          if (isLast)
          {
            // Only the last segment must be scalar
            return IsScalar(prop);
          }
          else
          {
            // Intermediate segments must be navigable (non-scalar object/collection)
            var nextType = UnwrapToNavigable(prop.PropertyType);
            if (nextType == null) return false;         // can't navigate into scalar/string
            if (IsScalarType(nextType)) return false;   // element type shouldn't be scalar
            type = nextType;
          }
        }
        // Shouldn't reach here
        return false;
      });
      var query = BuildQuery(source, includes);

      // Check if any includes involve collection navigation properties
      bool hasCollectionIncludes = includes.Any(includePath =>
      {
        var type = typeof(TEntity);
        foreach (var part in includePath.Split('.'))
        {
          var prop = type.GetProperty(part, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
          if (prop == null) break;

          // Check if this property is a collection using existing function
          if (IsCollectionType(prop.PropertyType, out var elementType))
          {
            type = elementType ?? prop.PropertyType;
            return true;
          }

          // Move to the property type
          type = prop.PropertyType;
        }
        return false;
      });

      if (allScalar)
      {
        // Apply projection for scalar-only queries
        var selector = BuildSelectorExpression<TEntity>(selectorPaths);
        query = query.Select(selector);

        // DISTINCT is only supported when there are NO collection navigations in the projection
        // EF Core cannot apply DISTINCT on projections containing collections
        if (!hasCollectionIncludes)
        {
          return query.Distinct();
        }
      }

      // Return query (with or without projection, but no DISTINCT if collections are included)
      // Note: EF Core does not support DISTINCT on queries with collection navigations
      return query;
    }

    /// <summary>
    /// Recursively builds MemberInit expression for nested projections.
    /// </summary>
    private static Expression BuildMemberInit(Type type, Expression root, HashSet<string> paths)
    {
      var groupedPaths = paths
          .Select(p => p.Split('.'))
          .GroupBy(parts => parts[0])
          .ToDictionary(g => g.Key, g => g.Select(parts => string.Join('.', parts.Skip(1))).Where(p => !string.IsNullOrEmpty(p)).ToList());

      var bindings = new List<MemberBinding>();

      foreach (var kvp in groupedPaths)
      {
        var prop = type.GetProperty(kvp.Key, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
        if (prop == null) continue;
        var memberExpr = Expression.Property(root, prop);
        if (kvp.Value.Count == 0)
        {
          bindings.Add(Expression.Bind(prop, memberExpr));
        }
        else if (typeof(IEnumerable).IsAssignableFrom(prop.PropertyType) && prop.PropertyType != typeof(string))
        {
          var itemType = prop.PropertyType.GetGenericArguments().FirstOrDefault();
          if (itemType == null) continue;

          var itemParam = Expression.Parameter(itemType, "x");
          var itemInit = BuildMemberInit(itemType, itemParam, new HashSet<string>(kvp.Value));
          var selector = Expression.Lambda(itemInit, itemParam);

          var selectMethod = typeof(Enumerable).GetMethods()
              .First(m => m.Name == "Select" && m.GetParameters().Length == 2)
              .MakeGenericMethod(itemType, itemType);

          var projectedCollection = Expression.Call(selectMethod, memberExpr, selector);
          Expression collectionExpr;
          var ctor = prop.PropertyType.GetConstructor(new[] { typeof(IEnumerable<>).MakeGenericType(itemType) });
                   if (ctor != null)
          {
            collectionExpr = Expression.New(ctor, projectedCollection);
          }
          else
          {
            var toListMethod = typeof(Enumerable).GetMethods()
                .First(m => m.Name == "ToList" && m.GetParameters().Length == 1)
                .MakeGenericMethod(itemType);

            collectionExpr = Expression.Call(toListMethod, projectedCollection);
          }
          var collectionNullCheck = ApplyNullCheck(memberExpr, collectionExpr);
          bindings.Add(Expression.Bind(prop, collectionNullCheck));
        }
        else
        {
          var nestedInit = BuildMemberInit(prop.PropertyType, memberExpr, new HashSet<string>(kvp.Value));
          var safeInit = ApplyNullCheck(memberExpr, nestedInit);
          bindings.Add(Expression.Bind(prop, safeInit));
        }
      }
      return Expression.MemberInit(Expression.New(type), bindings);
    }

    /// <summary>
    /// Adds null checks to nested initializations to avoid runtime errors.
    /// </summary>
    private static Expression ApplyNullCheck(Expression memberExpr, Expression nestedInit)
    {
      if (!memberExpr.Type.IsValueType || (memberExpr.Type.IsGenericType && memberExpr.Type.GetGenericTypeDefinition() == typeof(Nullable<>)))
      {
        return Expression.Condition(
            Expression.Equal(memberExpr, Expression.Constant(null, memberExpr.Type)),
            Expression.Constant(null, nestedInit.Type), // Ensure the null constant matches the type of nestedInit
            nestedInit
        );
      }
      return nestedInit;
    }


    private class CollectionContext
    {
      public string Path { get; set; } = "";
      public Type CollectionType { get; set; } = null!;
      public int Level { get; set; }
    }

    private class CollectionPropertyInfo
    {
      public PropertyInfo Property { get; set; } = null!;
      public Type ElementType { get; set; } = null!;
      public string NavigationPath { get; set; } = "";
      public int CommonAncestorDepth { get; set; } = 0; // how deep the common ancestor is
    }
  }
}
