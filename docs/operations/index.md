---
content_sources:
  - https://learn.microsoft.com/azure/communication-services/overview
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---

# Operations Overview

The Operations section provides guidance on managing Azure Communication Services (ACS) resources throughout their lifecycle, from initial provisioning to ongoing monitoring, security, and cost optimization.

<!-- diagram-id: operations-nav -->
```mermaid
graph TD
    Ops[Operations Hub] --> Prov[Provisioning]
    Ops --> Mon[Monitoring]
    Ops --> Sec[Security]
    Ops --> Cost[Cost Optimization]
    Ops --> Health[Health & Recovery]
    Ops --> Deploy[Deployment Strategies]
    
    Deploy --> IaC[Bicep & Terraform]
    Deploy --> CI[GitHub Actions]
```

## Operations Documentation

| Document | Description |
| --- | --- |
| [Provisioning](provisioning.md) | Resource creation, configuration, and channel setup (SMS/Email). |
| [Monitoring](monitoring.md) | Azure Monitor integration, key metrics, and diagnostic settings. |
| [Security](security.md) | Key rotation, RBAC, audit logging, and compliance. |
| [Cost Optimization](cost-optimization.md) | Budgeting, usage analysis, and right-sizing. |
| [Health & Recovery](health-recovery.md) | Incident response, failover, and backup strategies. |
| [Deployment Index](deployment/index.md) | Overview of deployment methods. |
| [Bicep & Terraform](deployment/bicep-terraform.md) | Infrastructure as Code examples for ACS. |
| [GitHub Actions](deployment/github-actions.md) | CI/CD pipelines for communication resources. |

## Quick Operational Commands

Common `az communication` commands for resource management:

```bash
# List all ACS resources in a subscription
az communication list --output table

# Get connection string for a specific resource
az communication list-key --name my-acs-resource --resource-group my-rg --query primaryConnectionString --output tsv

# Update a resource tag
az communication update --name my-acs-resource --resource-group my-rg --tags environment=prod
```

## See Also
- [Azure Communication Services CLI Reference](https://learn.microsoft.com/cli/azure/communication)
- [Service limits and quotas](https://learn.microsoft.com/azure/communication-services/concepts/service-limits)

## Sources
- [ACS Documentation Overview](https://learn.microsoft.com/azure/communication-services/overview)
