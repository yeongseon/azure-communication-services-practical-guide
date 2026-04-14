# AGENTS.md

## Project Overview
**Project Name:** Azure Communication Services Practical Guide  
**Description:** A comprehensive, hands-on guide for Azure Communication Services, covering SMS, Email, Chat, Voice, Video Calling, and Teams Interop from initial setup to production troubleshooting.  
**Core Mission:** Provide practical, evidence-based guidance that helps engineers design, operate, and troubleshoot ACS workloads with reproducible patterns and support-oriented playbooks.

## Repository Structure
- `apps/`: Minimal reference applications demonstrating ACS integration patterns.
    - `python/`: Python ACS samples and supporting assets.
    - `javascript/`: JavaScript ACS samples and supporting assets.
    - `java/`: Java ACS samples and supporting assets.
    - `dotnet/`: .NET ACS samples and supporting assets.
- `docs/`: Markdown documentation source for the MkDocs site.
    - `start-here/`: Orientation, learning paths, and repository map.
    - `platform/`: ACS architecture, resource model, auth, networking, events, and security.
    - `best-practices/`: Production baselines and operational design guidance.
    - `sdk-guides/`: Tutorials and recipes for each supported SDK language.
    - `operations/`: Provisioning, deployment, monitoring, recovery, and cost guidance.
    - `troubleshooting/`: Decision trees, playbooks, methodology, and KQL query packs.
    - `reference/`: Cheatsheets, limits, SDK reference, and lookup material.
    - `visualization/`: Knowledge graphs, troubleshooting maps, and learning path visuals.
- `.github/workflows/docs.yml`: GitHub Pages deployment workflow.
- `mkdocs.yml`: Configuration for the documentation site, including navigation, plugins, and theme settings.

## Content Types & Methodology

### 1. Troubleshooting Guides
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

### 2. Evidence Levels
When documenting analysis or troubleshooting conclusions, use these calibrated tags:
- `[Observed]`: Directly seen in logs, metrics, events, or portal output.
- `[Measured]`: Quantified behavior with explicit values or comparisons.
- `[Correlated]`: Signals changed together without proven causation.
- `[Inferred]`: Reasonable conclusion based on multiple pieces of evidence.
- `[Strongly Suggested]`: High-confidence conclusion without direct proof.
- `[Not Proven]`: Investigated but not definitively confirmed.
- `[Unknown]`: Insufficient data to conclude.

## Technical Standards & Conventions

### 1. Language Usage
- **Shell**: Use `bash` for CLI examples.
- **Python**: Use `python` for Python snippets.
- **JavaScript/TypeScript**: Use `javascript` or `typescript` as appropriate.
- **C#**: Use `csharp` for .NET examples.
- **Java**: Use `java` for Java examples.
- **KQL**: Use `kusto` for Kusto Query Language blocks.
- **Mermaid**: Use `mermaid` for diagrams.

### 2. CLI Standards
- Always use long flags for Azure CLI and related tooling.
- Do not include real phone numbers, email addresses, connection strings, access keys, tenant IDs, or subscription IDs in examples.

### 3. Documentation Style
- Prefer official Microsoft Learn documentation as the source basis for platform assertions.
- Use admonitions (`note`, `tip`, `warning`, `info`) for critical guidance.
- Keep terminology consistent across channels: SMS, Email, Chat, Voice & Video, Teams Interop.
- Diagrams should clarify flows such as auth, event routing, message delivery, or call signaling.

## Content Source Requirements

### 1. Microsoft Learn-First Policy
Core platform and architecture guidance should be traceable to official Microsoft Learn documentation:

- **Platform content** (`docs/platform/`): Must cite Microsoft Learn sources.
- **Best practices / operations**: Should cite Microsoft Learn where the guidance reflects platform behavior or limits.
- **Troubleshooting playbooks**: May synthesize operational experience, but should still anchor core platform claims to official docs.
- **Self-generated content**: Allowed when necessary, but include justification or source basis.

### 2. Source Types
| Type | Description | Allowed? |
|---|---|---|
| `mslearn` | Directly from Microsoft Learn | ✅ Preferred |
| `mslearn-adapted` | Microsoft Learn content adapted for this guide | ✅ With source URL |
| `self-generated` | Original synthesis for this guide | ✅ With justification |
| `community` | Community-sourced material | ⚠️ Supplemental only |
| `unknown` | Source not documented | ❌ Must be validated |

### 3. Diagram Source Documentation
Where source tracking is used, Mermaid diagrams should include source metadata in frontmatter:

```yaml
content_sources:
  diagrams:
    - id: acs-architecture-overview
      type: flowchart
      source: mslearn
      mslearn_url: https://learn.microsoft.com/
    - id: troubleshooting-flow
      type: flowchart
      source: self-generated
      justification: "Synthesized from ACS documentation and operational troubleshooting patterns"
```

## Quality Gates & Verification
1. **PII / Secret Check**: Verify no real phone numbers, email addresses, tenant IDs, access keys, or tokens are present.
2. **Navigation Integrity**: Ensure `mkdocs.yml` entries map to intended document paths.
3. **Link Validation**: Use `mkdocs build --strict` when requested or when validating integrated content.
4. **Evidence Integrity**: Troubleshooting guidance should clearly separate observed facts from inferred conclusions.
5. **Terminology Consistency**: Channel names and SDK names must remain consistent across docs.

## Build & Contribution
- **Build Command**: `pip install mkdocs-material mkdocs-minify-plugin && mkdocs build --strict`
- **Development Server**: `mkdocs serve`
- **Git Commit Types**:
    - `feat`: New guide section, tutorial, playbook, or recipe.
    - `fix`: Technical correction, broken nav path, or inaccurate guidance.
    - `docs`: Documentation clarity or wording improvement.
    - `chore`: Workflow, metadata, dependency, or configuration updates.
    - `refactor`: Structural improvements without changing meaning.
