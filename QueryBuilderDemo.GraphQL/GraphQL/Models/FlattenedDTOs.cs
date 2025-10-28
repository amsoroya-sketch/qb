namespace QueryBuilderDemo.GraphQL.GraphQL.Models;

/// <summary>
/// Flattened DTO combining Organisation and Department fields
/// </summary>
public class OrganisationDepartmentFlat
{
    // Organisation fields
    public int OrganisationId { get; set; }
    public string OrganisationName { get; set; } = string.Empty;
    public string OrganisationIndustry { get; set; } = string.Empty;
    public int OrganisationFoundYear { get; set; }

    // Department fields
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public decimal DepartmentBudget { get; set; }
    public string DepartmentHead { get; set; } = string.Empty;
}

/// <summary>
/// Flattened DTO combining Organisation, Department, and Employee fields
/// </summary>
public class OrganisationDepartmentEmployeeFlat
{
    // Organisation fields
    public int OrganisationId { get; set; }
    public string OrganisationName { get; set; } = string.Empty;
    public string OrganisationIndustry { get; set; } = string.Empty;
    public int OrganisationFoundYear { get; set; }

    // Department fields
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public decimal DepartmentBudget { get; set; }
    public string DepartmentHead { get; set; } = string.Empty;

    // Employee fields
    public int EmployeeId { get; set; }
    public string EmployeeFirstName { get; set; } = string.Empty;
    public string EmployeeLastName { get; set; } = string.Empty;
    public string EmployeeEmail { get; set; } = string.Empty;

    // Role fields
    public int RoleId { get; set; }
    public string RoleTitle { get; set; } = string.Empty;
    public string RoleLevel { get; set; } = string.Empty;
}

/// <summary>
/// Flattened DTO combining Department and Employee fields
/// </summary>
public class DepartmentEmployeeFlat
{
    // Department fields
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public decimal DepartmentBudget { get; set; }
    public string DepartmentHead { get; set; } = string.Empty;

    // Employee fields
    public int EmployeeId { get; set; }
    public string EmployeeFirstName { get; set; } = string.Empty;
    public string EmployeeLastName { get; set; } = string.Empty;
    public string EmployeeEmail { get; set; } = string.Empty;

    // Role fields
    public int RoleId { get; set; }
    public string RoleTitle { get; set; } = string.Empty;
    public string RoleLevel { get; set; } = string.Empty;
}

/// <summary>
/// Flattened DTO combining Employee and Project fields (many-to-many)
/// </summary>
public class EmployeeProjectFlat
{
    // Employee fields
    public int EmployeeId { get; set; }
    public string EmployeeFirstName { get; set; } = string.Empty;
    public string EmployeeLastName { get; set; } = string.Empty;
    public string EmployeeEmail { get; set; } = string.Empty;

    // Department fields
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;

    // Role fields
    public int RoleId { get; set; }
    public string RoleTitle { get; set; } = string.Empty;
    public string RoleLevel { get; set; } = string.Empty;

    // Project fields
    public int ProjectId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public DateTime ProjectDeadline { get; set; }
    public decimal ProjectBudget { get; set; }

    // Client fields
    public int ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
}

/// <summary>
/// Flattened DTO combining Project and Task fields
/// </summary>
public class ProjectTaskFlat
{
    // Project fields
    public int ProjectId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public DateTime ProjectDeadline { get; set; }
    public decimal ProjectBudget { get; set; }

    // Client fields
    public int ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientIndustry { get; set; } = string.Empty;

    // Task fields
    public int TaskId { get; set; }
    public string TaskTitle { get; set; } = string.Empty;
    public string TaskStatus { get; set; } = string.Empty;
    public DateTime TaskDueDate { get; set; }

    // Assigned Employee fields (nullable)
    public int? AssignedToId { get; set; }
    public string? AssignedToFirstName { get; set; }
    public string? AssignedToLastName { get; set; }
}

/// <summary>
/// Flattened DTO combining Employee and Skill fields (many-to-many)
/// </summary>
public class EmployeeSkillFlat
{
    // Employee fields
    public int EmployeeId { get; set; }
    public string EmployeeFirstName { get; set; } = string.Empty;
    public string EmployeeLastName { get; set; } = string.Empty;
    public string EmployeeEmail { get; set; } = string.Empty;

    // Department fields
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;

    // Skill fields
    public int SkillId { get; set; }
    public string SkillName { get; set; } = string.Empty;
    public string SkillCategory { get; set; } = string.Empty;
    public string SkillProficiency { get; set; } = string.Empty;
}

/// <summary>
/// Flattened DTO combining Client and Project fields
/// </summary>
public class ClientProjectFlat
{
    // Client fields
    public int ClientId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public string ClientIndustry { get; set; } = string.Empty;

    // Location fields
    public int LocationId { get; set; }
    public string LocationCity { get; set; } = string.Empty;
    public string LocationState { get; set; } = string.Empty;
    public string LocationCountry { get; set; } = string.Empty;

    // Project fields
    public int ProjectId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public DateTime ProjectDeadline { get; set; }
    public decimal ProjectBudget { get; set; }
}
