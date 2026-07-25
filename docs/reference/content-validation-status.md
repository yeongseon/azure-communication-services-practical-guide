---
description: Manual status snapshot of `content_validation` metadata coverage across in-scope factual-claim pages in the Azure Communication Services Practical Guide.
---

# Content Validation Status

!!! warning "This is a manual status snapshot, not an auto-generated dashboard"
    This page is authored and updated by hand. No script generates it, and no CI job enforces its accuracy. It reflects the state of the repository at the `Last updated` date below. Sibling guides in the series (Azure Container Apps, Azure Monitoring) run a generator script and a validator; this repository does not, and the accompanying gap is tracked separately (see [Follow-up tracking](#follow-up-tracking) below).

**Last updated**: 2026-07-25
**Method**: Manual repository scan using `scripts/lib/content_scope.py` plus frontmatter inspection for `content_validation:` blocks.

## What `content_validation` is

`content_validation` is YAML frontmatter that records the verification state of a page's core factual claims. Each in-scope factual-claim page is expected to carry a block like this:

```yaml
content_validation:
  status: verified  # verified | pending_review | unverified
  last_reviewed: 2026-07-01
  reviewer: agent  # agent | human
  core_claims:
    - claim: "ACS Email total email request size (including attachments) is 10 MB, upgradable to 30 MB via support request."
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits
      verified: true
```

The full schema and the list of in-scope directories are defined in [`AGENTS.md` → Content Validation Scope](https://github.com/yeongseon/azure-communication-services-practical-guide/blob/main/AGENTS.md#content-validation-scope). This status page does not redefine either.

## Current coverage

The repository currently contains **54 markdown files** with a `content_validation` block. Of those, **46 are in-scope** (per the AGENTS.md scope policy) and **8 are out-of-scope**.

Against the population of in-scope factual-claim pages, current coverage is **46 / 46 = 100%**. All currently in-scope pages now carry `content_validation` metadata.

| Metric | Count |
|---|---:|
| Total files with `content_validation` (in-scope + out-of-scope) | 54 |
| In-scope files with `content_validation` | 46 |
| Out-of-scope files carrying `content_validation` | 8 |
| In-scope factual-claim pages (denominator) | 46 |
| In-scope coverage | 100% |

The out-of-scope count is called out separately because those blocks **do not count toward compliance with the AGENTS.md scope policy** — they are legacy metadata on reference and KQL pages that pre-date the scope formalization.

## In-scope pages WITH `content_validation`

All currently in-scope pages under `docs/platform/**`, `docs/best-practices/**`, `docs/operations/**`, and the in-scope troubleshooting pages now carry `content_validation`. Coverage by section is:

| Section | In-scope pages | With `content_validation` | Coverage |
|---|---:|---:|---:|
| Platform | 8 | 8 | 100% |
| Best Practices | 7 | 7 | 100% |
| Operations | 8 | 8 | 100% |
| Troubleshooting | 23 | 23 | 100% |
| **Total** | **46** | **46** | **100%** |

## In-scope pages WITHOUT `content_validation`

There are currently **no** in-scope factual-claim pages without `content_validation` metadata.

## Out-of-scope pages that carry `content_validation`

These 8 pages contain a `content_validation` block, but they fall outside the required-by-default scope in AGENTS.md (`docs/reference/**` and `docs/troubleshooting/kql/**`). Their blocks are historical and are **not counted toward in-scope coverage**.

| Page | Directory | Why out of scope |
|---|---|---|
| [`reference/platform-limits.md`](platform-limits.md) | `docs/reference/**` | Reference lookup, not a factual-claim page per AGENTS.md scope |
| [`reference/kql-queries.md`](kql-queries.md) | `docs/reference/**` | Reference lookup |
| `troubleshooting/kql/voice-video/index.md` | `docs/troubleshooting/kql/**` | KQL query pack, not a factual-claim page |
| `troubleshooting/kql/voice-video/call-quality-metrics.md` | `docs/troubleshooting/kql/**` | KQL query pack |
| `troubleshooting/kql/sms/index.md` | `docs/troubleshooting/kql/**` | KQL query pack |
| `troubleshooting/kql/sms/delivery-status.md` | `docs/troubleshooting/kql/**` | KQL query pack |
| `troubleshooting/kql/chat/index.md` | `docs/troubleshooting/kql/**` | KQL query pack |
| `troubleshooting/kql/chat/message-latency.md` | `docs/troubleshooting/kql/**` | KQL query pack |

Leaving these blocks in place is intentional — the metadata is still useful as author-level notes — but they are not part of the policy-compliance calculation.

## What is NOT implemented in this repository

To avoid overclaiming, the following pieces of the validation workflow are **not** present in this repository today:

- **No content-validation generator script.** This repository now has `scripts/lib/content_scope.py`, but it still does not have `scripts/generate_content_validation_status.py`; this page remains authored manually.
- **No CI enforcement of `content_validation`.** The repository still lacks a drift-check or validation workflow that fails when an in-scope page is missing `content_validation` or when this manual dashboard is stale.
- **No automatic content-validation drift check.** The repository has `scripts/validate_content_sources.py` for diagram provenance, but it does not yet have a generator/check pair for `content_validation` coverage.
- **No dashboard drift check.** Sibling guides re-run the generator in CI and fail if the checked-in dashboard is stale. Because this page is manual, that check does not apply here; stale content on this page can only be caught by human review.

The policy itself (which directories require `content_validation`, and the schema of the block) IS documented — see [`AGENTS.md` → Content Validation Scope](https://github.com/yeongseon/azure-communication-services-practical-guide/blob/main/AGENTS.md#content-validation-scope). The gap is between policy and enforcement, not between policy and existence.

## How to add coverage to an in-scope page

1. Confirm the page is in scope by checking [`AGENTS.md` → Content Validation Scope](https://github.com/yeongseon/azure-communication-services-practical-guide/blob/main/AGENTS.md#content-validation-scope). Pages under `docs/reference/**`, `docs/troubleshooting/kql/**`, `docs/troubleshooting/lab-guides/**`, `docs/sdk-guides/**`, and `docs/start-here/**` are usually out of scope — do not add `content_validation` there.
2. Identify 2–5 core factual claims on the page. Each must be a specific assertion (a documented limit, a documented behavior, a documented default), not a meta-statement like "this page uses Microsoft Learn as the primary source basis."
3. Trace each claim to a Microsoft Learn URL. If a claim cannot be traced, either remove the claim from the page or set `verified: false` and leave the source blank.
4. Add the frontmatter block (see [What `content_validation` is](#what-content_validation-is) above).
5. Set `status: verified` only when ALL listed `core_claims` have `verified: true` AND cite Microsoft Learn URLs.
6. Update this status page in the same commit — add the page to the [In-scope pages WITH `content_validation`](#in-scope-pages-with-content_validation) table and remove it from the examples in [In-scope pages WITHOUT `content_validation`](#in-scope-pages-without-content_validation).

## Follow-up tracking

Coverage expansion is complete in this repository snapshot. Tooling parity with sibling guides — especially a generated `content-validation-status` dashboard, a tutorial-validation dashboard generator, and CI drift enforcement — remains follow-up work.

## See Also

- [`AGENTS.md` → Content Validation Scope](https://github.com/yeongseon/azure-communication-services-practical-guide/blob/main/AGENTS.md#content-validation-scope) — authoritative scope and schema definition
- [Platform Limits](platform-limits.md) — example of an out-of-scope reference page that still carries historical `content_validation` metadata
- [Operations → Monitoring](../operations/monitoring.md) — example of an in-scope page with `content_validation`

## Sources

- Azure Communication Services Documentation Home — <https://learn.microsoft.com/en-us/azure/communication-services/>
