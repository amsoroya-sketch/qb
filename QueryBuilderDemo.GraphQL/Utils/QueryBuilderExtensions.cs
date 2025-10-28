using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Linq.Expressions;
using System.Reflection;

namespace QueryBuilderDemo.GraphQL.Utils
{
    /// <summary>
    /// Extension methods for building flattened queries
    /// </summary>
    public static class QueryBuilderExtensions
    {
        /// <summary>
        /// Extension method for BuildFlattenedQuery with generic type parameter
        /// Flattens hierarchical data by performing SelectMany operations on collections
        /// </summary>
        public static IQueryable BuildFlattenedQuery<T>(this IQueryable<T> query, HashSet<string> selectFields) where T : class
        {
            var entityType = typeof(T);
            var fieldsList = selectFields.ToList();

            // Preprocess: expand any entity/collection references to their scalar fields
            var expandedFieldsList = ExpandFieldsToScalars(fieldsList, entityType, expandNestedEntities: false);

            var collectionLevels = FindAllCollectionLevels(expandedFieldsList, entityType);

            if (collectionLevels.Count == 0)
            {
                var regularSelectString = BuildSelectString(expandedFieldsList);
                return query.Select($"new ({regularSelectString})");
            }

            IQueryable flattenedQuery = query;
            Type currentSourceType = entityType;
            var contextStructure = new List<CollectionContext>();

            for (int i = 0; i < collectionLevels.Count; i++)
            {
                var collectionPath = collectionLevels[i];
                var collectionInfo = GetCollectionPropertyInfo(entityType, collectionPath, contextStructure);

                flattenedQuery = ApplySelectManyWithExpressionTree(flattenedQuery, currentSourceType, collectionInfo, contextStructure);

                contextStructure.Add(new CollectionContext
                {
                    Path = collectionPath,
                    CollectionType = collectionInfo.ElementType,
                    Level = i
                });

                currentSourceType = flattenedQuery.ElementType;
            }

            var projectionParts = BuildProjectionWithContextStructure(expandedFieldsList, contextStructure);
            var projectionString = string.Join(", ", projectionParts);

            // Apply Distinct to eliminate duplicate rows from cartesian products
            return flattenedQuery.Select($"new ({projectionString})").Distinct();
        }

        /// <summary>
        /// Expands entity/collection references to their scalar fields
        /// </summary>
        private static List<string> ExpandFieldsToScalars(List<string> selectFields, Type rootEntityType, bool expandNestedEntities = true)
        {
            var expandedFields = new List<string>();

            foreach (var field in selectFields)
            {
                if (string.IsNullOrWhiteSpace(field)) continue;

                var parts = field.Split('.');
                var currentType = rootEntityType;

                for (int i = 0; i < parts.Length; i++)
                {
                    var part = parts[i];
                    var prop = currentType.GetProperty(part, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);

                    if (prop == null)
                    {
                        expandedFields.Add(field);
                        break;
                    }

                    if (i == parts.Length - 1)
                    {
                        if (IsScalar(prop))
                        {
                            expandedFields.Add(field);
                        }
                        else
                        {
                            var targetType = GetEnumerableType(prop.PropertyType) ?? prop.PropertyType;
                            var scalarFields = GetAllScalarFields(targetType, field, null, expandNestedEntities);
                            expandedFields.AddRange(scalarFields);
                        }
                    }
                    else
                    {
                        currentType = GetEnumerableType(prop.PropertyType) ?? prop.PropertyType;
                    }
                }
            }

            return expandedFields.Distinct().ToList();
        }

        /// <summary>
        /// Recursively gets all scalar field paths for a given type
        /// </summary>
        private static List<string> GetAllScalarFields(Type type, string basePath = "", HashSet<Type>? visitedTypes = null, bool expandNestedEntities = true)
        {
            var scalarFields = new List<string>();

            if (visitedTypes == null)
            {
                visitedTypes = new HashSet<Type>();
            }

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
                    scalarFields.Add(fieldPath);
                }
                else if (IsCollectionType(prop.PropertyType, out var elementType))
                {
                    // Skip collections - they should be explicitly specified
                    continue;
                }
                else
                {
                    // Entity reference
                    if (expandNestedEntities)
                    {
                        var nestedType = prop.PropertyType;
                        var branchVisitedTypes = new HashSet<Type>(visitedTypes);
                        var nestedFields = GetAllScalarFields(nestedType, fieldPath, branchVisitedTypes, expandNestedEntities);
                        scalarFields.AddRange(nestedFields);
                    }
                }
            }

            return scalarFields;
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

            return collections.OrderBy(c => c.Count(ch => ch == '.')).ThenBy(c => c).ToList();
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

        private static IQueryable ApplySelectManyWithExpressionTree(
            IQueryable query,
            Type sourceType,
            CollectionPropertyInfo collectionInfo,
            List<CollectionContext> existingContext)
        {
            var outerParam = Expression.Parameter(sourceType, "outer");
            Expression collectionAccess;

            if (existingContext.Count == 0)
            {
                collectionAccess = Expression.Property(outerParam, collectionInfo.Property);
            }
            else
            {
                Expression targetExpression;
                if (collectionInfo.CommonAncestorDepth == 0)
                {
                    targetExpression = outerParam;
                    for (int i = 0; i < existingContext.Count; i++)
                    {
                        var outerProperty = targetExpression.Type.GetProperty("Outer");
                        if (outerProperty == null)
                            throw new InvalidOperationException($"Property 'Outer' not found on type {targetExpression.Type.Name}");
                        targetExpression = Expression.Property(targetExpression, outerProperty);
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
                    targetExpression = outerParam;
                    int stepsBack = existingContext.Count - collectionInfo.CommonAncestorDepth;
                    for (int i = 0; i < stepsBack; i++)
                    {
                        var outerProperty = targetExpression.Type.GetProperty("Outer");
                        if (outerProperty == null)
                            throw new InvalidOperationException($"Property 'Outer' not found on type {targetExpression.Type.Name}");
                        targetExpression = Expression.Property(targetExpression, outerProperty);
                    }

                    var innerProperty = targetExpression.Type.GetProperty("Inner");
                    if (innerProperty == null)
                        throw new InvalidOperationException($"Property 'Inner' not found on type {targetExpression.Type.Name}");
                    targetExpression = Expression.Property(targetExpression, innerProperty);
                }
                collectionAccess = Expression.Property(targetExpression, collectionInfo.Property);
            }

            var enumerableType = typeof(IEnumerable<>).MakeGenericType(collectionInfo.ElementType);
            var collectionSelectorType = typeof(Func<,>).MakeGenericType(sourceType, enumerableType);
            var collectionSelector = Expression.Lambda(collectionSelectorType, collectionAccess, outerParam);

            var innerParam = Expression.Parameter(collectionInfo.ElementType, "inner");

            var anonType = new { Outer = default(object), Inner = default(object) }.GetType().GetGenericTypeDefinition();
            var resultType = anonType.MakeGenericType(sourceType, collectionInfo.ElementType);

            var constructor = resultType.GetConstructors()[0];
            var outerProp = resultType.GetProperty("Outer")!;
            var innerProp2 = resultType.GetProperty("Inner")!;

            var newExpression = Expression.New(
                constructor,
                new Expression[] { outerParam, innerParam },
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
                            return funcArgs.Length == 2;
                        }
                    }
                    return false;
                })
                .First()
                .MakeGenericMethod(sourceType, collectionInfo.ElementType, resultType);

            return (IQueryable)selectManyMethod.Invoke(null, new object[] { query, collectionSelector, resultSelector })!;
        }

        private static List<string> BuildProjectionWithContextStructure(List<string> selectFields, List<CollectionContext> contextStructure)
        {
            var projectionParts = new List<string>();
            var totalLevels = contextStructure.Count;
            foreach (var fields in selectFields)
            {
                var alias = fields.Replace(".", "_");
                string projectionPath = MapFieldToNestedContext(fields, contextStructure, totalLevels);
                projectionParts.Add($"{projectionPath} as {alias}");
            }
            return projectionParts;
        }

        private static string MapFieldToNestedContext(string fieldPath, List<CollectionContext> contextStructure, int totalLevels)
        {
            int belongsToLevel = -1;
            for (int i = contextStructure.Count - 1; i >= 0; i--)
            {
                if (fieldPath.StartsWith(contextStructure[i].Path + "."))
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
                if (belongsToLevel == totalLevels - 1)
                {
                    return $"Inner.{remainingPath}";
                }
                else
                {
                    var levelsDeeper = totalLevels - belongsToLevel - 1;
                    var outerChain = string.Join(".", Enumerable.Repeat("Outer", levelsDeeper));
                    return $"{outerChain}.Inner.{remainingPath}";
                }
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

        private static bool IsScalarType(Type type)
        {
            type = Nullable.GetUnderlyingType(type) ?? type;

            if (type == typeof(string)) return true;
            if (type.IsEnum) return true;
            if (type.IsPrimitive || type.IsValueType) return true;

            var elem = GetEnumerableType(type);
            if (elem != null)
            {
                return IsScalarType(elem);
            }

            return false;
        }

        private static bool IsScalar(PropertyInfo prop)
        {
            return IsScalarType(prop.PropertyType);
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
            public int CommonAncestorDepth { get; set; } = 0;
        }
    }
}
