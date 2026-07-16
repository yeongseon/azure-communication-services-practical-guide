# AGENTS.md

Guidance for AI agents working in this repository.

## Project Overview

**Azure Communication Services Practical Guide** — a comprehensive, hands-on guide for Azure Communication Services, covering SMS, Email, Chat, Voice, Video Calling, and Teams Interop from initial setup to production troubleshooting.

- **Live site**: <https://yeongseon.github.io/azure-communication-services-practical-guide/>
- **Repository**: <https://github.com/yeongseon/azure-communication-services-practical-guide>

**Core Mission:** Provide practical, evidence-based guidance that helps engineers design, operate, and troubleshoot ACS workloads with reproducible patterns and support-oriented playbooks.

## Series-Wide Documentation Contract

This repository is part of the Azure Practical Guide series. All repositories in the series must preserve a consistent reader experience while allowing repository-specific extensions.

### Core Sections

Every service-focused repository SHOULD use these core sections unless the repository-specific addendum explains an exception.

| Section | Required | Purpose |
|---|---:|---|
| `Start Here` | Yes | Entry points, overview, learning paths, repository map |
| `Platform` | Yes | Service concepts, architecture, core behavior |
| `Best Practices` | Yes | Production patterns, anti-patterns, design guidance |
| `Operations` | Yes | Day-2 operational procedures and verification |
| `Troubleshooting` | Yes | Symptom-based diagnosis, playbooks, evidence collection |
| `Reference` | Yes | CLI, KQL, limits, glossary, decision tables |

### Approved Extension Sections

| Section | Use When |
|---|---|
| `Tutorials` | The repository provides hands-on learning or lab sequences |
| `Lab Guides` | Reproducible experiments or validation exercises are first-class content |
| `Language Guides` | The service has language/runtime-specific implementation tutorials |
| `SDK Guides` | The service is primarily consumed through SDKs |
| `Service Guides` | The repository configures or monitors multiple Azure services |
| `Workload Guides` | The repository is architecture/workload oriented |
| `Architecture Reviews` | The repository includes architecture review methodology and playbooks |
| `Design Labs` | The repository includes architecture design exercises |
| `Visualization` | Visual maps are a deliberate learning surface, not generated leftovers |
| `Meta` | Repository taxonomy, content model, or generated metadata |

Do not create a new top-level section if the content can fit under one of the core or approved extension sections.

### ACS-Specific Addendum

Azure Communication Services is a channel- and SDK-oriented service. This repository uses `SDK Guides` instead of `Language Guides`.

Approved ACS extension sections:

| Section | Purpose |
|---|---|
| `SDK Guides` | Python, JavaScript, Java, and .NET SDK tutorials and recipes |
| `Visualization` | Channel maps, knowledge graphs, troubleshooting maps |
| `Meta` | Repository taxonomy and content model |

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
│   ├── best-practices/         # Production baselines and anti-patterns (8 pages)
│   ├── javascripts/            # Mermaid zoom JS
│   ├── meta/                   # Repository taxonomy and content model (1 page)
│   ├── operations/             # Provisioning, deployment, monitoring, recovery (9 pages)
│   │   └── deployment/         # Bicep/Terraform, GitHub Actions
│   ├── platform/               # ACS architecture, resource model, auth, networking (9 pages)
│   ├── reference/              # CLI cheatsheet, limits, SDK reference (5 pages)
│   ├── sdk-guides/
│   │   ├── python/             # Python — 7 tutorials + 8 recipes
│   │   ├── javascript/         # JavaScript — 7 tutorials + 8 recipes
│   │   ├── java/               # Java — 7 tutorials + 7 recipes
│   │   └── dotnet/             # .NET — 7 tutorials + 7 recipes
│   ├── start-here/             # Overview, learning paths, repository map (3 pages)
│   ├── stylesheets/            # Custom CSS (mermaid zoom, etc.)
│   ├── troubleshooting/        # Decision trees, playbooks, KQL, methodology (30+ pages)
│   │   ├── first-10-minutes/   # SMS, email, chat, calling quick checks
│   │   ├── kql/                # KQL query packs by channel
│   │   ├── lab-guides/         # Hands-on troubleshooting labs
│   │   ├── methodology/        # Troubleshooting method, detector map
│   │   └── playbooks/          # Per-channel playbooks (SMS, email, chat, voice, Teams)
│   └── visualization/          # Knowledge graphs, troubleshooting maps (4 pages)
└── mkdocs.yml                  # MkDocs Material configuration
```

## Start Here Rules

`Start Here` is orientation content. It must not become a language tutorial, SDK tutorial, operations runbook, troubleshooting playbook, or lab guide.

Required pages:

| Page | Purpose |
|---|---|
| `overview.md` | Who this guide is for, what is in scope, and what is out of scope |
| `learning-paths.md` | Role-based and experience-based reading paths |
| `repository-map.md` | Map of major sections and when to use them |

Optional pages:

| Page Pattern | Purpose |
|---|---|
| `when-to-use-*.md` | Service selection guidance |
| `prerequisites.md` | Required tools, permissions, and accounts |
| `common-scenarios.md` | Common use cases |
| `*-vs-other-compute.md` | Positioning against neighboring Azure services |
| `how-to-use-this-guide.md` | Reader navigation guidance |

`learning-paths.md` MUST:

- Start with role-based or goal-based paths.
- Link to tutorials instead of embedding a full tutorial sequence.
- Avoid service-specific code walkthroughs except short examples.
- Avoid `content_validation` unless this repository explicitly includes Start Here pages in content validation scope.

Preferred title:

```markdown
# Learning Paths
```

Avoid:

```markdown
# Tutorial: {Service} for {Language}
```

## Navigation Budget

The left navigation should help orientation, not expose every file.

Recommended:

- Top-level sections SHOULD stay between 6 and 9 items.
- Direct children under a top-level section SHOULD stay between 5 and 8 items.
- Large collections such as tutorials, recipes, KQL packs, lab guides, and playbooks SHOULD be listed on index pages rather than fully expanded in `mkdocs.yml`.
- Use hub pages, tables, tags, and search for deep inventory.
- Keep `mkdocs.yml` readable enough that a contributor can understand the site structure without scrolling through hundreds of deep links.

Preferred troubleshooting structure:

```text
Troubleshooting
├─ Overview
├─ Quick Diagnosis
├─ Decision Tree
├─ First 10 Minutes
├─ Playbooks
├─ KQL Query Packs
└─ Labs
```

Avoid exposing every individual playbook, KQL query, and lab guide in `mkdocs.yml` unless the repository is intentionally small.

## Content Validation Scope

`content_validation` is required for factual-claim pages, not for every Markdown file.

Required by default:

- `docs/platform/**`
- `docs/best-practices/**`
- `docs/operations/**`
- factual troubleshooting methodology/playbook pages

Usually out of scope:

- `docs/start-here/**`
- `docs/reference/**`
- `docs/language-guides/**`
- `docs/sdk-guides/**`
- `docs/tutorials/**`
- `docs/troubleshooting/kql/**`
- `docs/troubleshooting/lab-guides/**`
- generated dashboards
- navigation-only index pages

Content-type-specific rules:

- Tutorials use `validation`.
- Labs use evidence and falsification integrity.
- KQL packs document query purpose, expected interpretation, required tables, and assumptions.
- KQL packs do not need `content_validation` unless they make factual platform claims outside the query explanation.
- Never fabricate validation dates or test results.

## Mermaid Diagrams

Use Mermaid diagrams when they clarify architecture, flow, dependency, decision logic, or troubleshooting paths.

Required for:

- Platform architecture pages
- Complex operations pages
- Decision trees
- Troubleshooting playbooks with multi-step diagnosis
- Lab guides with failure progression or evidence timelines
- Architecture review or design decision flows

Optional for:

- Reference tables
- CLI cheatsheets
- Glossary pages
- Generated validation dashboards
- Short landing pages
- Simple tutorial steps where prose is clearer

Do not add a diagram just to satisfy a checkbox. A diagram must explain something better than prose or a table.

### Diagram Orientation Rule

- **Sequential flows with 5+ nodes**: Use `flowchart TD` (top-down) to prevent horizontal overflow.
- **Short diagrams with fewer than 5 nodes**: `flowchart LR` (left-right) is acceptable.
- **Layered architecture diagrams** (e.g., network layers, stack diagrams): Always use `flowchart TD`.

```mermaid
%% CORRECT — 5+ node sequential flow uses TD
flowchart TD
    A[Commit] --> B[Build and test]
    B --> C[Package artifact]
    C --> D[Deploy to staging]
    D --> E[Validation]
    E --> F[Swap to production]

%% WRONG — long horizontal overflow
flowchart LR
    A[Commit] --> B[Build and test] --> C[Package] --> D[Deploy] --> E[Validate] --> F[Swap]
```

## Image and Screenshot Rules

Images must support the reader's task. Do not add screenshots only for decoration.

Every referenced image MUST have:

- Descriptive alt text.
- A nearby explanation of what the reader should verify.
- No real subscription IDs, tenant IDs, object IDs, emails, phone numbers, secrets, keys, connection strings, or customer data.
- Visual verification before merge when the image is referenced from Markdown.

Recommended explanation pattern:

```markdown
![ACS resource overview showing a healthy Communication Services resource](../assets/example.png)

Purpose: Confirm why this image exists.
Look for: Tell the reader what values or states to confirm.
Expected result: State the healthy or expected condition.
Next step: Link the image to the next action.
```

Portal screenshots:

- Prefer text replacement over black-box redaction.
- Use black-box masking only for unavoidable avatar/profile pixels and only with the repository-approved mask color.
- If a screenshot cannot be visually verified, remove the Markdown reference or disclose the debt explicitly in the PR.

## Microsoft Learn URL Locale

All `learn.microsoft.com` URLs SHOULD use the `en-us` locale prefix.

Canonical form:

```text
https://learn.microsoft.com/en-us/azure/communication-services/...
```

Avoid locale-less URLs (URLs missing the `/en-us/` segment immediately after the hostname):

```text
https://learn.microsoft.com/<missing-locale>/azure/communication-services/...
```

The `<missing-locale>` placeholder marks the position where `/en-us/` must appear. A real locale-less URL would omit that segment entirely; the placeholder is used here only so this anti-pattern example does not trip the `scripts/normalize_mslearn_locale.py` CI gate.

Reason:

- Stable reader experience.
- Stable reviewer experience.
- Easier link checking.
- Less URL drift across repositories.

## Related Projects

| Repository | Description |
|---|---|
| [azure-virtual-machine-practical-guide](https://github.com/yeongseon/azure-virtual-machine-practical-guide) | Azure Virtual Machines practical guide |
| [azure-networking-practical-guide](https://github.com/yeongseon/azure-networking-practical-guide) | Azure Networking practical guide |
| [azure-storage-practical-guide](https://github.com/yeongseon/azure-storage-practical-guide) | Azure Storage practical guide |
| [azure-app-service-practical-guide](https://github.com/yeongseon/azure-app-service-practical-guide) | Azure App Service practical guide |
| [azure-functions-practical-guide](https://github.com/yeongseon/azure-functions-practical-guide) | Azure Functions practical guide |
| [azure-communication-services-practical-guide](https://github.com/yeongseon/azure-communication-services-practical-guide) | Azure Communication Services practical guide |
| [azure-container-apps-practical-guide](https://github.com/yeongseon/azure-container-apps-practical-guide) | Azure Container Apps practical guide |
| [azure-kubernetes-service-practical-guide](https://github.com/yeongseon/azure-kubernetes-service-practical-guide) | Azure Kubernetes Service (AKS) practical guide |
| [azure-architecture-practical-guide](https://github.com/yeongseon/azure-architecture-practical-guide) | Azure Architecture practical guide |
| [azure-monitoring-practical-guide](https://github.com/yeongseon/azure-monitoring-practical-guide) | Azure Monitoring practical guide |

## Content Categories

The documentation is organized by intent and lifecycle stage:

| Section | Purpose | Page Count |
|---|---|---|
| **Start Here** | Entry points, learning paths, repository map | 3 |
| **Platform** | ACS architecture, resource model, auth, networking, events, security | 9 |
| **Best Practices** | Production baselines, security, reliability, scaling, cost | 8 |
| **SDK Guides** | Per-language step-by-step tutorials and recipes (Python, JS, Java, .NET) | 65+ |
| **Operations** | Provisioning, deployment, monitoring, recovery, cost optimization | 9 |
| **Troubleshooting** | Decision trees, playbooks, KQL packs, methodology — per channel | 30+ |
| **Reference** | CLI cheatsheet, platform limits, KQL queries, SDK reference | 5 |
| **Visualization** | Knowledge graphs, troubleshooting maps, learning path visuals | 4 |
| **Meta** | Repository taxonomy and content model | 1 |

!!! info "Platform vs Best Practices vs Operations"
    - **Platform** = Understand the concepts and architecture.
    - **Best Practices** = Apply practical patterns and avoid common mistakes.
    - **Operations** = Execute day-2 tasks in production.

## Documentation Conventions

### File Naming

- Tutorial: `XX-topic-name.md` (numbered for sequence)
- All others: `topic-name.md` (kebab-case)

### CLI Command Style

```bash
# ALWAYS use long flags for readability
az communication sms send --sender "<sender-phone>" --recipient "<recipient-phone>" --message "Hello" --connection-string "$ACS_CONNECTION_STRING"

# NEVER use short flags in documentation
az communication sms send -s "<sender>" -r "<recipient>"  # ❌ Don't do this
```

### Variable Naming Convention

| Variable | Description | Example |
|----------|-------------|---------|
| `$RG` | Resource group name | `rg-acs-demo` |
| `$ACS_NAME` | ACS resource name | `acs-demo-resource` |
| `$ACS_CONNECTION_STRING` | ACS connection string placeholder | `<acs-connection-string>` |
| `$LOCATION` | Azure region | `koreacentral` |
| `$SUBSCRIPTION_ID` | Subscription identifier placeholder | `<subscription-id>` |
| `$EMAIL_DOMAIN` | Email communication domain | `contoso.com` |
| `$SENDER_PHONE` | Sender phone number placeholder | `<sender-phone>` |

### Language Usage

- **Shell**: Use `bash` for CLI examples.
- **Python**: Use `python` for Python snippets.
- **JavaScript/TypeScript**: Use `javascript` or `typescript` as appropriate.
- **C#**: Use `csharp` for .NET examples.
- **Java**: Use `java` for Java examples.
- **KQL**: Use `kusto` for Kusto Query Language blocks.
- **Mermaid**: Use `mermaid` for diagrams.

### Channel Terminology

Keep terminology consistent across all documentation:

- **SMS** — Short message service
- **Email** — Email communication
- **Chat** — Real-time chat threads
- **Voice & Video** — Voice and video calling
- **Teams Interop** — Microsoft Teams interoperability

## Content Types & Methodology

### Troubleshooting Guides

Troubleshooting content should help readers quickly move from symptom to evidence to fix. Prefer this structure where applicable:

1. **Question**: What specific failure or uncertainty is being investigated?
2. **Scope**: Which ACS capability is affected (SMS, Email, Chat, Voice/Video, Teams Interop)?
3. **Signals**: What logs, events, metrics, or portal symptoms are visible?
4. **Hypothesis**: What likely cause explains the behavior?
5. **Checks**: What should be verified first?
6. **Evidence**: Raw data, logs, API responses, or KQL output.
7. **Analysis**: How the evidence supports or weakens the hypothesis.
8. **Resolution**: The recommended corrective action.
9. **Prevention**: Guardrails or design changes to avoid recurrence.
10. **Support Takeaway**: The shortest summary a support engineer should remember.

### Evidence Levels

When documenting analysis or troubleshooting conclusions, use these calibrated tags:

| Tag | Description |
|-----|-------------|
| `[Observed]` | Directly seen in logs, metrics, events, or portal output |
| `[Measured]` | Quantified behavior with explicit values or comparisons |
| `[Correlated]` | Signals changed together without proven causation |
| `[Inferred]` | Reasonable conclusion based on multiple pieces of evidence |
| `[Strongly Suggested]` | High-confidence conclusion without direct proof |
| `[Not Proven]` | Investigated but not definitively confirmed |
| `[Unknown]` | Insufficient data to conclude |

### Playbooks

Each playbook includes:

1. Symptom description and hypotheses
2. Evidence collection steps
3. **Sample Log Patterns** — real log lines from Azure deployment
4. **KQL Queries with Example Output** — 2-3 queries with result tables + `!!! tip "How to Read This"` interpretation
5. **CLI Investigation Commands** — with example output and interpretation
6. **Normal vs Abnormal Comparison** — table
7. **Common Misdiagnoses** section
8. **Related Labs** — cross-links to lab guide docs

### Lab Guides

Each lab guide includes:

1. Background and failure progression model
2. Falsifiable hypothesis
3. Step-by-step runbook
4. Experiment log with real artifact data
5. **Expected Evidence** section:
    - Before Trigger (Baseline)
    - During Incident
    - After Recovery
    - Evidence Timeline (Mermaid)
    - Evidence Chain: Why This Proves the Hypothesis (falsification logic)
6. Related Playbook cross-links

### Data Verification

All playbook evidence and lab guide data should be collected from real Azure deployments:

- ACS channels: SMS, Email, Chat, Voice & Video, Teams Interop
- Data sources: ACSBillingUsage, ACSChatIncomingOperations, ACSEmailStatusUpdateOperational, ACSSMSIncomingOperations
- KQL collected via REST API or Log Analytics portal
- All data sanitized (PII removed)

## Content Source Requirements

### Microsoft Learn First Policy

All content must be traceable to official Microsoft Learn documentation.

- Platform content must have direct Microsoft Learn source URLs.
- Architecture diagrams must reference official Microsoft documentation.
- Troubleshooting playbooks may synthesize Microsoft Learn content with clear attribution.
- Self-generated content must include justification explaining the source basis.

### Source Types

| Type | Description | Allowed? |
|---|---|---|
| `mslearn` | Directly from Microsoft Learn | Required for platform content |
| `mslearn-adapted` | Microsoft Learn content adapted for this guide | Allowed with source URL |
| `self-generated` | Original content for this guide | Requires justification |
| `community` | From community sources | Not allowed for core content |
| `unknown` | Source not documented | Must be validated |

### Diagram Source Documentation

Every Mermaid diagram must have source metadata in frontmatter.

```yaml
content_sources:
  diagrams:
    - id: acs-architecture-overview
      type: flowchart
      source: mslearn
      mslearn_url: https://learn.microsoft.com/en-us/azure/communication-services/concepts/architecture
    - id: troubleshooting-flow
      type: flowchart
      source: self-generated
      justification: "Synthesized from ACS documentation and operational troubleshooting patterns"
```

### Text Content Validation

Factual-claim documents include a `content_validation` block in frontmatter to track the verification status of their core claims. See `## Content Validation Scope` above for the required paths and out-of-scope paths.

```yaml
---
content_sources:
  - type: mslearn-adapted
    url: https://learn.microsoft.com/en-us/azure/communication-services/...
content_validation:
  status: verified  # verified | pending_review | unverified
  last_reviewed: 2026-04-14
  reviewer: agent  # agent | human
  core_claims:
    - claim: "ACS supports managed identity for authentication"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/authentication
      verified: true
    - claim: "Email requires custom domain verification via DNS TXT records"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-domain-and-sender-authentication
      verified: true
---
```

#### Validation Status Values

| Status | Description |
|--------|-------------|
| `verified` | All core claims have been traced to Microsoft Learn sources |
| `pending_review` | Document exists but claims need source verification |
| `unverified` | New document, no validation performed |

#### Agent Rules for Content Validation

1. When creating or modifying Platform, Best Practices, or Operations documents, add `content_validation` frontmatter.
2. List 2-5 core claims that are factual assertions (not opinions or procedures).
3. Each claim must have a Microsoft Learn source URL.
4. Set `status: verified` only when ALL core claims have verified sources.

## Quality Gates & Verification

1. **PII / Secret Check**: Verify no real phone numbers, email addresses, tenant IDs, access keys, connection strings, or tokens are present.
2. **Navigation Integrity**: Ensure `mkdocs.yml` entries map to intended document paths.
3. **Link Validation**: Use `mkdocs build --strict` when requested or when validating integrated content.
4. **Evidence Integrity**: Troubleshooting guidance should clearly separate observed facts from inferred conclusions.
5. **Terminology Consistency**: Channel names (SMS, Email, Chat, Voice & Video, Teams Interop) and SDK names must remain consistent across docs.

### PII Removal

**CRITICAL**: All CLI output examples MUST have PII removed.

**Must mask (real Azure identifiers):**

- Subscription IDs: `<subscription-id>`
- Tenant IDs: `<tenant-id>`
- Object IDs: `<object-id>`
- Resource IDs containing real subscription/tenant
- Phone numbers: `<sender-phone>`, `<recipient-phone>`
- Connection strings: `<acs-connection-string>`
- Emails: Remove or mask as `user@example.com`
- Secrets/Tokens: NEVER include

**OK to keep (synthetic example values):**

- Demo correlation IDs: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- Example request IDs in logs
- Placeholder domains: `example.com`, `contoso.com`
- Sample resource names used consistently in docs

The goal is to prevent leaking **real Azure account information**, not to mask obviously-fake example values that aid readability.

### Admonition Indentation Rule

For MkDocs admonitions (`!!!` / `???`), every line in the body must be indented by **4 spaces**.

```markdown
!!! warning "Important"
    This line is correctly indented.

    - List item also inside
```

### Nested List Indentation

All nested list items MUST use **4-space indent** (Python-Markdown standard).

```markdown
# CORRECT (4-space)
1. **Item**
    - Sub item
    - Another sub item
        - Third level

# WRONG (2 or 3 spaces)
1. **Item**
  - Sub item          ← 2 spaces ❌
   - Sub item         ← 3 spaces ❌
```

### Tail Section Naming

Every document ends with these tail sections (in this order):

| Section | Purpose | Content |
|---|---|---|
| `## See Also` | Internal cross-links within this repository | Links to other pages in this guide |
| `## Sources` | External authoritative references | Links to Microsoft Learn (primary) |

- `## See Also` is required on every page.
- `## Sources` is required when external references are cited. Omit if none exist.
- Order is always `## See Also` → `## Sources` (never reversed).
- All content must be based on Microsoft Learn with cited sources.

### Canonical Document Templates

Every document follows one of 7 templates based on its section. Do not invent new structures.

#### Platform docs

```text
# Title
Brief introduction (1-2 sentences)
## Prerequisites (optional — only if hands-on/CLI content)
## Main Content
### Subsections (H3 under Main Content)
#### Sub-subsections (H4 as needed)
## Advanced Topics (optional)
## Channel-Specific Details (optional)
## See Also
## Sources (optional)
```

#### Best Practices docs

```text
# Title
Brief introduction
## Prerequisites (optional)
## Why This Matters
## Recommended Practices
## Common Mistakes / Anti-Patterns
## Validation Checklist
## Advanced Topics (optional)
## See Also
## Sources (optional)
```

#### Operations docs

```text
# Title
Brief introduction
## Prerequisites
## When to Use
## Procedure
## Verification
## Rollback / Troubleshooting
## Advanced Topics (optional)
## See Also
## Sources (optional)
```

#### Tutorial docs (SDK Guides)

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

#### Playbooks

```text
# Title (no intro paragraph — Summary covers it)
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

#### Lab Guides

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

#### Reference docs

```text
# Title
Brief introduction
## Prerequisites (optional)
## Topic/Command Groups
## Usage Notes (optional)
## See Also
## Sources (optional)
```

## Tutorial Validation Tracking

Every tutorial document supports **validation frontmatter** that records when and how it was last tested against a real Azure deployment.

### Frontmatter Schema

Add a `validation` block inside the YAML frontmatter (`---` fences) of any tutorial file:

```yaml
---
hide:
  - toc
validation:
  az_cli:
    last_tested: 2026-04-14
    cli_version: "2.83.0"
    sdk_version: "1.2.0"
    result: pass
  bicep:
    last_tested: null
    result: not_tested
---
```

### Field Reference

| Field | Type | Values | Description |
|---|---|---|---|
| `result` | string | `pass`, `fail`, `not_tested` | Outcome of the validation run |
| `last_tested` | date or null | `2026-04-14` / `null` | ISO date of last test, null if never tested |
| `cli_version` | string | `"2.83.0"` | Azure CLI version used during testing |
| `sdk_version` | string | `"1.2.0"` | ACS SDK version used during testing |

### Validation Methods

Each tutorial can be validated via two independent methods:

- **az_cli** — Manual step-by-step execution using Azure CLI commands
- **bicep** — Infrastructure-as-code deployment using Bicep templates

### Staleness Rule

Tutorials not validated within **90 days** are flagged as **stale** on the dashboard.

### Agent Rules for Validation

1. **After deploying a tutorial end-to-end**, add or update the `validation` frontmatter with the current date, CLI version, and `result: pass`.
2. **If a tutorial step fails during validation**, set `result: fail` and note the issue — do NOT remove existing passing metadata for the other method.
3. **Never fabricate validation dates.** Only stamp a tutorial after actually executing all steps against a real Azure environment.
4. **After updating frontmatter**, regenerate the dashboard:
    ```bash
    python3 scripts/generate_validation_status.py
    ```
5. **Include the regenerated dashboard** (`docs/reference/validation-status.md`) in the same commit as the frontmatter change.
6. **Do not manually edit** `docs/reference/validation-status.md` — it is auto-generated by the script.

## Portal Capture Workflow

The repository embeds Azure Portal screenshots at a fixed **5120 × 2472 high-DPI** resolution to stay visually consistent with the sibling `azure-container-apps-practical-guide` `operations/` convention. All Portal captures must follow this workflow.

### Capture parameters

| Setting | Value | Why |
|---|---|---|
| Viewport | 2560 × 1236 CSS pixels | Matches container-apps reference; renders Portal's full left-nav + main blade without wrap |
| Device scale factor | `2` (CDP `Emulation.setDeviceMetricsOverride`) | Produces 5120 × 2472 device-pixel PNG, sharp on Retina/4K |
| Portal host | `ms.portal.azure.com` with tenant hint fragment (`#@<tenant>/...`) | Faster than `portal.azure.com`, scopes login to the right tenant |
| UI language | English | Avoid locale-specific term drift |
| Re-navigation | `browser_navigate` between every capture | Portal CSS state is cumulative; flyouts and tooltips leak across captures |

### Authenticating the capture browser (Conditional Access)

The capture browser MUST reuse a **device-compliant, interactively signed-in** session. A fresh, isolated Chromium — whether launched by standalone Playwright or by the MCP browser tool — is **not** an Intune-enrolled / device-compliant browser, so it CANNOT pass Microsoft Entra Conditional Access for the MSIT (`ms.portal.azure.com`) tenant. It loops on the sign-in / `ConditionalAccess/Enrollment` ("install Company Portal") wall. **Do not** burn cycles trying to defeat this from automation — it is a device-level security control, not a cookie problem.

Working pattern (attach to a real, human-authenticated Chrome over CDP):

1. **Launch the user's Chrome with a dedicated debug profile and a remote-debugging port.** A dedicated `--user-data-dir` avoids Chrome's block on debugging the default profile, and OS-level Platform SSO / Company Portal still satisfies device compliance:
    ```bash
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      --remote-debugging-port=9222 \
      --user-data-dir="$HOME/.chrome-portal-capture" \
      --no-first-run --no-default-browser-check \
      "https://ms.portal.azure.com/"
    ```
2. **The human signs in interactively (including MFA) and navigates to the target blade.** The agent CANNOT complete MFA — hand this step to the user explicitly and wait.
3. **Verify the port is bound before attaching:** `curl -s http://localhost:9222/json/version`, and poll `http://localhost:9222/json` to detect when the target blade URL has loaded.
4. **Attach Playwright over CDP** with `chromium.connectOverCDP('http://localhost:9222')`, pick the page whose URL contains `portal.azure.com`, apply the PII substitution + avatar overlay, then screenshot. `browser.close()` on a CDP-attached browser only detaches the debugger; it does NOT close the user's Chrome.

Common failure: relaunching the Chrome binary while Chrome is already running just opens a tab in the existing (non-debug) process and silently ignores `--remote-debugging-port`. Always confirm the port with `curl`/`nc` before assuming the debug instance is up.

### Save path convention

```text
docs/assets/<top-level-section>/<topic>/<NN>-<short-name>.png
```

Examples:

- `docs/assets/operations/email-provisioning/01-create-email-service.png`
- `docs/assets/troubleshooting/email-delivery/06a-diagnostic-settings.png`

The `<top-level-section>` matches the embedding markdown's section (`operations/`, `troubleshooting/`, etc.). The `<topic>` is a slug naming the workflow being captured. The `NN` prefix preserves capture order in plan files.

### PII rules

Every capture must mask:

| Real value | Replacement | Rationale |
|---|---|---|
| Subscription IDs (UUID) | `00000000-0000-0000-0000-000000000000` | Prevents Azure account leak |
| Tenant IDs / hints | `contoso.onmicrosoft.com` | Removes org identification |
| Object IDs (UUID) | `00000000-0000-0000-0000-000000000000` | Removes principal identification |
| Phone numbers | `<sender-phone>`, `<recipient-phone>` | Removes PII |
| Email addresses (real users) | `user@example.com` | Removes PII |
| ACS connection strings | `<acs-connection-string>` | Critical: contains access key |
| AzureManagedDomain GUID prefix | `<azure-managed-domain>.azurecomm.net` | Reduces fingerprinting |
| Account avatar (top-right) | Solid Portal-blue `#0078d4` overlay | Removes profile photo without black-box |

Synthetic/example values (e.g., demo correlation IDs in the docs themselves) may be kept as-is — the goal is to prevent real Azure account leaks, not to obscure obviously-fake placeholders.

### Pipeline (5 steps, idempotent per capture)

1. **CDP DPR override** — `Emulation.setDeviceMetricsOverride { width: 2560, height: 1236, deviceScaleFactor: 2, mobile: false }`. Sticky across navigations within the same session.
2. **PII substitution** — Run the substitution script against the main frame and every iframe (Portal blades render in sandbox iframes). Include `input.value` for any visible form fields.
3. **Avatar overlay** — Compute the avatar element's `getBoundingClientRect()` and inject a `position: fixed` `<div>` with Portal-blue background covering that rect. No black-box masking.
4. **CDP screenshot** — `Page.captureScreenshot { format: "png" }` returns base64.
5. **Browser-side download** — Inject an `<a>` with a `data:` URL of the PNG and click it; `page.waitForEvent('download')` resolves; `download.saveAs(<absolute-path>)` writes the file. Confirms file size > 100KB and dimensions match 5120 × 2472 before marking the capture complete.

The helper script lives at `scripts/portal-capture-helpers.md` (documentation) and `scripts/portal-capture-helpers.js` (Node.js implementation). The capture pipeline is idempotent — running it again on the same page produces an identical output.

### Plan files

Each capture series has a plan file under `scripts/`:

- `scripts/email-capture-plan.md` — Email Service captures (7 captures)
- Future: `scripts/sms-capture-plan.md`, etc.

The plan file is the **source of truth** for what should be captured. When a capture pivots from the plan (e.g., a target blade does not render as expected), update the plan file with a `Reality (observed during capture)` note explaining the pivot. Pivots are not failures; they are part of the documentation.

### Pivots and known Portal quirks

The capture process has surfaced several Portal-specific quirks that future captures should anticipate:

- **Hidden left-nav items**: Items under collapsed sections exist in the DOM with valid `href` attributes but render at 0 × 0. Use the `href` for direct navigation (deep-link) instead of clicking.
- **Span-as-button clicks fail**: Some Portal controls (e.g., `<span role="button">Edit setting</span>`) ignore Playwright `locator.click()` and `focus()+Enter`. Portal SPA wraps real telemetry-bearing mouse events. Workarounds: CDP `Input.dispatchMouseEvent` with synthesized coordinates, or pivot to a list view that conveys the same information.
- **Monaco editor in sandbox iframe**: KQL queries on LAW Logs blades render Monaco inside a sandboxed iframe. Synthetic key events often drop. Workaround: pre-fill via URL fragment (`#@<tenant>/resource/.../logs/<base64-query>`) which bypasses Monaco interaction entirely.
- **Sandbox iframe content**: Many blades render in `iframe[sandbox]` with `srcdoc` content. Apply PII substitution to every frame, not just the main one.
- **URL fragment routing strictness**: Some blade routes are exact (`/diagnostics`) and silently redirect to `/resource_overview` on near-misses (`/diagnosticLogs`). Discover correct URLs by inspecting `href` attributes in the left-nav, not by guessing from documentation.

### Validation per capture

A capture is complete only when:

- [ ] File exists at the expected path with size > 100 KB and dimensions 5120 × 2472
- [ ] PII substitution script ran and reported ≥ 1 replacement (zero replacements suggests the script did not see the rendered text)
- [ ] Avatar overlay was applied (or `requireAvatarMask: false` was set explicitly for blades without a top bar)
- [ ] Visual review confirms no real subscription IDs, tenant hints, emails, phone numbers, or connection strings remain
- [ ] The capture is embedded in at least one markdown page with descriptive alt text

## Build & Preview

```bash
# Install MkDocs dependencies
pip install mkdocs-material mkdocs-minify-plugin

# Build documentation (strict mode catches broken links)
mkdocs build --strict

# Local preview
mkdocs serve
```

## Git Commit Style

```text
type: short description
```

Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`
