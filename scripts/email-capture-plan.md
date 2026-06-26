# Email Service Capture Plan

This file documents the seven Portal captures the Email Service area needs.
It serves as the source of truth for what should be captured, where to save
the output, and what blades to navigate to. The orchestration is executed
manually (or via MCP browser) — there is no fully automated runner yet
because the Azure Portal requires interactive authentication.

## Constants

| Value | Setting |
|---|---|
| Subscription | `1375a781-21fb-430a-be54-2465c36b0ee2` (sanitized → `00000000-0000-0000-0000-000000000000`) |
| Tenant hint | `microsoft.onmicrosoft.com` (sanitized → `contoso.onmicrosoft.com`) |
| Resource group | `rg-acs-email-lab` |
| ACS resource | `acs-email-lab` |
| Email Service | `ecs-email-lab` |
| AzureManaged sender | `1fd6375c-ccc6-4d45-a1a7-1dfeb3657fa0.azurecomm.net` (sanitized → `<azure-managed-domain>.azurecomm.net`) |
| Custom domain (unverified) | `contoso-demo.example.com` |
| Log Analytics | `law-acs-email-lab` |
| Diagnostic setting | `acs-diag-all` |

Portal base URL: `https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/`

## Captures

### 1. Email Communication Service overview

- **Output**: `docs/assets/operations/email-provisioning/01-create-email-service.png`
- **Embed target**: `docs/operations/email-provisioning.md` (new) and
  `docs/sdk-guides/python/tutorial/03-send-email.md`
- **Route**: `ecs-email-lab` → Overview (post-creation landing blade).
- **What to show**: The Essentials section populated (resource group,
  subscription, location, data location) plus the "Add your email domains"
  call-to-action with the two cards (`Add a free Azure subdomain` and
  `Setup a custom domain`).
- **Wait for**: The Essentials grid renders all six rows (Resource group,
  Status, Location, Subscription, Subscription ID, Data location) and the
  domain CTA cards become visible.
- **Note**: The original capture plan called for the Marketplace Create blade
  with Basics tab populated. We pivoted to the Overview blade because it
  renders cleanly in a single navigation, has no popup overlays to dismiss,
  shows post-creation state (which is what readers see after running the
  documented `az communication email create` command), and avoids capturing
  a half-filled form that does not exist in the real provisioning workflow.

### 2. Provision domains grid (managed + custom side-by-side)

- **Output**: `docs/assets/operations/email-provisioning/02-provision-domains.png`
- **Embed target**: `docs/operations/email-provisioning.md`
- **Route**: `ecs-email-lab` → Provision domains (left nav, Settings group →
  `settings_domainitem`).
- **What to show**: The Provision domains grid with both domains:
    - `contoso-demo.example.com` (Custom domain) — Domain / SPF / DKIM / DKIM2
      statuses all "Configure" (unverified, awaiting DNS).
    - `<azure-managed-domain>.azurecomm.net` (Azure subdomain) — Domain / SPF /
      DKIM / DKIM2 statuses all "Verified".
- **Wait for**: The grid renders both rows with their status columns
  populated (i.e., 4 status columns × 2 rows = 8 status cells visible).
- **Note**: The original capture plan called for an `AzureManagedDomain`
  Overview blade with a "Verification status" panel showing
  Domain/SPF/DKIM/DKIM2/DMARC rows. That panel does not exist for Azure-
  managed domains because managed domains are auto-verified by Azure —
  the AzureManagedDomain Overview only renders an Essentials section
  (resource group, status, location, subscription, email send quota, tags).
  We pivoted to the parent email service's Provision domains grid because
  it shows the verified state of the managed domain alongside the
  unverified state of the custom domain, which is the contrast the
  surrounding documentation explains and which sets up capture #3 (the
  custom-domain DNS verification wizard).

### 3. Custom domain DNS verification

- **Output**: `docs/assets/operations/email-provisioning/03-custom-domain-verification.png`
- **Embed target**: `docs/operations/email-provisioning.md` and
  `docs/troubleshooting/first-10-minutes/email-delivery.md`
- **Route**: `ecs-email-lab` → Provision domains → `contoso-demo.example.com`
  → "Verify domain" pane.
- **What to show**: The TXT records the user must add (Domain TXT, SPF, DKIM,
  DKIM2, DMARC) with their values, statuses all in "Not started".
- **Wait for**: The DNS records table is populated (at least Domain TXT row
  visible).
- **Reality (observed during capture)**: The Portal does not render a single
  consolidated DNS records table. Instead, each record type (Domain TXT, SPF,
  DKIM, DKIM2) opens its own separate verification wizard from the Provision
  domains grid. The capture shows the Domain TXT wizard (which is the first
  and gating record). DMARC is not surfaced as a wizard — it is documented
  separately. See the Reality note in the embedded markdown for what readers
  should expect after they click each "Configure" link.

### 4. Link domain to ACS resource

- **Output**: `docs/assets/operations/email-provisioning/04-link-domain-to-acs.png`
- **Embed target**: `docs/operations/email-provisioning.md`
- **Route**: `acs-email-lab` → Email → Domains.
- **What to show**: The "Connect domain" command bar entry and the
  `AzureManagedDomain` row already connected, with its full sender address.
- **Wait for**: The connected domains grid renders the AzureManagedDomain row.

### 5. MailFrom / Sender username

- **Output**: `docs/assets/operations/email-provisioning/05-mailfrom-sender.png`
- **Embed target**: `docs/operations/email-provisioning.md`
- **Route**: AzureManagedDomain → MailFrom addresses OR Sender usernames.
- **What to show**: Configured sender usernames (DoNotReply is auto-created)
  plus the "Add" command. If the MailFrom address blade is more meaningful,
  capture that instead.
- **Wait for**: The grid shows at least the default `DoNotReply` row.
- **Reality (observed during capture)**: For an `AzureManagedDomain` the
  Portal renders the MailFrom addresses blade with the `Add` command
  **disabled** (Azure-managed domains cannot accept custom MailFrom rewrites
  — only verified custom domains can). The default `DoNotReply` sender that
  the documentation references is also **not shown as a row in this blade**
  for AzureManagedDomain — it exists at the SMTP-envelope level and is the
  implicit identity used when the linked ACS resource calls `SendEmail`.
  The capture therefore documents the disabled state rather than a populated
  grid. Readers configuring a custom domain will see different (enabled)
  behavior; the embedded markdown calls this out explicitly.

### 6. Diagnostic settings + KQL

Split into two captures because they live on different resources.

#### 6a. Diagnostic settings on ACS resource

- **Output**: `docs/assets/troubleshooting/email-delivery/06a-diagnostic-settings.png`
- **Embed target**: `docs/operations/monitoring.md` (and
  `docs/troubleshooting/first-10-minutes/email-delivery.md`)
- **Route**: `acs-email-lab` → Diagnostic settings (URL fragment is
  `.../acs-email-lab/diagnostics`, **not** `/diagnosticLogs` — the latter
  silently redirects to `/resource_overview`).
- **What to show**: The destination (Log Analytics) plus the categoryGroup
  `allLogs` enabled and metric `AllMetrics` enabled.
- **Reality (observed during capture)**: We originally planned to capture
  the `acs-diag-all` Edit blade so readers could see the category checklist
  in the form it is configured. The `<span role="button">Edit setting</span>`
  control in the list view did **not** respond to Playwright `locator.click`
  or `focus()+Enter` (Portal SPA requires a real telemetry-wrapped mouse
  event that the MCP browser cannot synthesize). We pivoted to the list view
  capture because it is actually more informative: it shows the destination
  (`law-acs-email-lab`), the setting name (`acs-diag-all`), and **all
  available ACS email log categories** (Email Service Send Mail Logs,
  Email Service Delivery Status Update Logs, Email Service User Engagement
  Logs) on one blade. This matches the prior pivot patterns for captures
  #2 and #5 (capture what is actually rendered, not the idealized blade).

#### 6b. KQL query result for ACSEmailStatusUpdateOperational

- **Output**: `docs/assets/troubleshooting/email-delivery/06b-kql-statusupdate.png`
- **Embed target**: `docs/troubleshooting/first-10-minutes/email-delivery.md`
- **Route**: `law-acs-email-lab` → Logs → run the query below.
- **Query**:
  ```kusto
  ACSEmailStatusUpdateOperational
  | where TimeGenerated > ago(24h)
  | summarize Count=count() by DeliveryStatus
  | order by Count desc
  ```
- **Pre-req**: 5+ minutes after `send-capture-data.py` ran so the diagnostic
  pipeline has emitted rows. The test data used `ago(24h)` window because
  the capture session began ~3 hours after the send burst — `ago(1h)` would
  return no rows.
- **What to show**: Three result rows summarizing the delivery breakdown
  (blank/initial, `OutForDelivery`, `Delivered`) with counts visible.
- **Reality (observed during capture)**: The Portal LAW Logs blade opens in
  **Simple mode** by default (a guided query builder), which has no Run button
  and no Monaco editor. To enter raw KQL you must first toggle the working
  mode dropdown at the top-right of the editor pane (`KENDO-DROPDOWNLIST`
  with `aria-label="Choose working mode"`) and select **KQL mode**, which
  reveals the Monaco editor and the Run button. The original plan's
  URL-fragment pre-fill strategy (base64 query in the URL fragment) was
  not used because directly setting the Monaco editor model via
  `window.monaco.editor.getEditors()[0].getModel().setValue(query)` from
  inside the sandbox iframe is more reliable (works the same regardless of
  query length and special characters that would need to be URL-encoded).
  The breakdown query was chosen over the original detail query because the
  three-row aggregated result is easier to read at 5120×2472 and matches the
  embedded narrative ("most rows are blank initial states, then equal counts
  of OutForDelivery and Delivered").

### 7. Email Insights / Metrics dashboard

- **Output**: `docs/assets/operations/monitoring/07-email-insights.png`
- **Embed target**: `docs/operations/monitoring.md`
- **Route**: `acs-email-lab` → Email → Insights (preview) OR Monitoring →
  Metrics with `EmailRequests` metric selected.
- **What to show**: A chart of recent email send activity with a non-empty
  visible series (the 7 test sends should be enough).
- **Pre-req**: Same 5–10 minute settling time as 6b.
- **Reality (observed during capture)**: The Email → Insights (preview)
  blade requires a verified custom domain to render workbook visuals;
  AzureManagedDomain-only resources see an empty Insights page. We pivoted
  to **Monitoring → Metrics** with `Communication Services standard metrics`
  namespace + `Email Service API Requests` metric + `Count` aggregation.
  ACS Email exposes three metrics on this namespace (API Requests, Delivery
  Status Updates, User Engagement); the API Requests count is the most
  intuitive starting point because each `SendEmail` call increments it by
  one (or more, when internal retries fire). The capture shows the 24-count
  spike at 12 PM Fri 26 that corresponds to the 7-email test burst with its
  internal retry traffic — the same data window the 6b KQL query covers,
  visualized as a time-series instead of a row breakdown.

## Operating notes

- Re-navigate (`browser_navigate`) between captures. Do not rely on left-nav
  state from the previous blade.
- Use viewport **2560 × 1236 CSS pixels with `deviceScaleFactor: 2`** before
  the first capture; do not resize mid-run. This produces a 5120 × 2472
  device-pixel PNG that matches the `azure-container-apps-practical-guide`
  `operations/` convention. For MCP captures, the helper snippet applies the
  CDP `Emulation.setDeviceMetricsOverride` per call (idempotent), so simply
  re-using the snippet in `portal-capture-helpers.md` is sufficient.
- Wait for blade-specific text (not just `networkidle`) to confirm render is
  complete before applying PII rewrites.
- Apply the PII script every capture, even if the blade looks clean — text
  can be late-injected into DOM nodes after `networkidle`.
- If a capture fails the avatar mask check, the helper throws. Re-trigger
  the page render rather than override `requireAvatarMask` unless the blade
  legitimately has no top bar.

## Resource cleanup

After all captures land and embeds are committed, decide whether to keep
the resource group for re-captures or tear it down:

```bash
az group delete --name rg-acs-email-lab --yes --no-wait
```
