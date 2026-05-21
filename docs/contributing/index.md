---
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---

# Contributing

Thank you for your interest in contributing to Azure Communication Services Practical Guide!

## Quick Start

1. Fork the repository
2. Clone: `git clone https://github.com/yeongseon/azure-communication-services-practical-guide.git`
3. Install dependencies: `pip install mkdocs-material mkdocs-minify-plugin`
4. Start local preview: `mkdocs serve`
5. Open `http://127.0.0.1:8000` in your browser
6. Create a feature branch: `git checkout -b feature/your-change`
7. Make changes and validate: `mkdocs build --strict`
8. Submit a Pull Request

## Repository Structure

```text
.
├── .github/
│   └── workflows/              # GitHub Pages deployment
├── apps/
│   ├── python/                 # Python ACS samples and supporting assets
│   ├── javascript/             # JavaScript ACS samples and supporting assets
│   ├── java/                   # Java ACS samples and supporting assets
│   └── dotnet/                 # .NET ACS samples and supporting assets
├── docs/
│   ├── assets/                 # Images, icons
│   ├── best-practices/         # Production baselines and anti-patterns
│   ├── javascripts/            # Mermaid zoom JS
│   ├── meta/                   # Repository taxonomy and content model
│   ├── operations/             # Provisioning, deployment, monitoring, recovery
│   │   └── deployment/         # Bicep/Terraform, GitHub Actions
│   ├── platform/               # ACS architecture, resource model, auth, networking
│   ├── reference/              # CLI cheatsheet, limits, SDK reference
│   ├── sdk-guides/
│   │   ├── python/             # Python tutorials + recipes
│   │   ├── javascript/         # JavaScript tutorials + recipes
│   │   ├── java/               # Java tutorials + recipes
│   │   └── dotnet/             # .NET tutorials + recipes
│   ├── start-here/             # Overview, learning paths, repository map
│   ├── stylesheets/            # Custom CSS
│   ├── troubleshooting/        # Decision trees, playbooks, KQL, methodology
│   │   ├── first-10-minutes/   # Channel quick checks
│   │   ├── kql/                # KQL query packs by channel
│   │   ├── lab-guides/         # Hands-on troubleshooting labs
│   │   ├── methodology/        # Troubleshooting method, detector map
│   │   └── playbooks/          # Per-channel playbooks
│   └── visualization/          # Knowledge graphs, troubleshooting maps
└── mkdocs.yml                  # MkDocs Material configuration
```

## Content Categories

| Section | Purpose |
|---|---|
| **Start Here** | Entry points, learning paths, repository map |
| **Platform** | ACS architecture, resource model, auth, networking, events, security — WHAT and HOW it works |
| **Best Practices** | Production baselines, security, reliability, scaling, cost — HOW to use the platform well |
| **SDK Guides** | Per-language step-by-step tutorials and recipes (Python, JS, Java, .NET) |
| **Operations** | Provisioning, deployment, monitoring, recovery, cost optimization — HOW to run in production |
| **Troubleshooting** | Decision trees, playbooks, KQL packs, methodology — per channel |
| **Reference** | Quick lookup — CLI cheatsheet, platform limits, KQL queries, SDK reference |
| **Visualization** | Knowledge graphs, troubleshooting maps, learning path visuals |

## Document Templates

Every document must follow the template for its section. Do not invent new structures.

### Platform docs

```text
# Title
Brief introduction (1-2 sentences)
## Prerequisites (optional)
## Main Content
### Subsections
## Advanced Topics (optional)
## See Also
## Sources
```

### Best Practices docs

```text
# Title
Brief introduction
## Why This Matters
## Recommended Practices
## Common Mistakes / Anti-Patterns
## Validation Checklist
## See Also
## Sources
```

### Operations docs

```text
# Title
Brief introduction
## Prerequisites
## When to Use
## Procedure
## Verification
## Rollback / Troubleshooting
## See Also
## Sources
```

### Tutorial docs (SDK Guides)

```text
# Title
Brief introduction
## Prerequisites
## What You'll Build
## Steps
## Verification
## Next Steps / Clean Up (optional)
## See Also
## Sources (optional)
```

### Playbooks

```text
# Title (no intro paragraph)
## 1. Summary
## 2. Common Misreadings
## 3. Competing Hypotheses
## 4. What to Check First
## 5. Evidence to Collect
## 6. Validation and Disproof by Hypothesis
## 7. Likely Root Cause Patterns
## 8. Immediate Mitigations
## 9. Prevention (optional)
## See Also
## Sources (optional)
```

### Lab Guides

```text
# Title
Brief introduction
## Lab Metadata (table: difficulty, duration, channel, etc.)
## 1) Background
## 2) Hypothesis
## 3) Runbook
## 4) Experiment Log
## Expected Evidence
## Clean Up
## Related Playbook
## See Also
## Sources
```

### Reference docs

```text
# Title
Brief introduction
## Topic/Command Groups
## Usage Notes
## See Also
## Sources
```

## Writing Standards

### CLI Commands

```bash
# ALWAYS use long flags for readability
az communication sms send --sender "<sender-phone>" --recipient "<recipient-phone>" --message "Hello" --connection-string "$ACS_CONNECTION_STRING"

# NEVER use short flags in documentation
az communication sms send -s "<sender>" -r "<recipient>"  # ❌ Don't do this
```

### Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `$RG` | Resource group name | `rg-acs-demo` |
| `$ACS_NAME` | ACS resource name | `acs-demo-resource` |
| `$ACS_CONNECTION_STRING` | ACS connection string placeholder | `<acs-connection-string>` |
| `$LOCATION` | Azure region | `koreacentral` |
| `$SUBSCRIPTION_ID` | Subscription identifier placeholder | `<subscription-id>` |

### Mermaid Diagrams

All architectural diagrams use Mermaid. Every documentation page should include at least one diagram.

### Nested Lists

All nested list items MUST use **4-space indent** (Python-Markdown standard).

### Admonitions

For MkDocs admonitions, indent body content by **4 spaces**:

```markdown
!!! warning "Title"
    Body text here.
```

### Tail Sections

Every document ends with these sections in order:

1. `## See Also` — internal cross-links within this repository
2. `## Sources` — external references (Microsoft Learn URLs)

## Content Source Policy

All content must be traceable to official Microsoft Learn documentation.

| Source Type | Description | Allowed? |
|---|---|---|
| `mslearn` | Directly from Microsoft Learn | Required for platform content |
| `mslearn-adapted` | Adapted from Microsoft Learn | Yes, with source URL |
| `self-generated` | Original content | Requires justification |

## PII Rules

NEVER include real Azure identifiers in documentation or examples:

- Subscription IDs: use `<subscription-id>`
- Tenant IDs: use `<tenant-id>`
- Emails: use `user@example.com`
- Phone numbers: `<sender-phone>`, `<recipient-phone>`
- Secrets, tokens, connection strings: NEVER include

## Build and Validate

```bash
# Install dependencies
pip install mkdocs-material mkdocs-minify-plugin

# Validate (must pass before submitting PR)
mkdocs build --strict

# Local preview
mkdocs serve
```

## Git Commit Style

```
type: short description
```

Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`

## Review Process

1. Automated CI checks (MkDocs build)
2. Maintainer review for accuracy and completeness
3. Merge to main triggers GitHub Pages deployment

## Code of Conduct

Please read our [Code of Conduct](https://github.com/yeongseon/azure-communication-services-practical-guide/blob/main/CODE_OF_CONDUCT.md) before contributing.

## See Also

- [Repository Map](../start-here/repository-map.md)
- [Learning Paths](../start-here/learning-paths.md)
