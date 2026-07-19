---
description: Test execution report for the Azure Communication Services Email channel, including setup, execution, observations, and interpretation.
---

# Email Communication Service Test Report

## 1. Overview
The purpose of this test was to validate Azure Communication Services (ACS) Email functionality end-to-end using the Python SDK. The scope included resource provisioning, sending various email types, delivery confirmation, and monitoring.

- **Date**: April 14, 2026
- **Tester environment**: Azure CLI + Python 3.12 + `azure-communication-email==1.1.0`

## 2. Resource Provisioning
All resources were created in the `rg-acs-email-lab` resource group (koreacentral).

| Resource | Name | Type |
|---|---|---|
| Resource Group | rg-acs-email-lab | `Microsoft.Resources/resourceGroups` |
| ACS Resource | acs-email-lab | `Microsoft.Communication/communicationServices` |
| Email Service | ecs-email-lab | `Microsoft.Communication/emailServices` |
| Email Domain | AzureManagedDomain | `Microsoft.Communication/emailServices/domains` |
| Log Analytics | law-acs-email-lab | `Microsoft.OperationalInsights/workspaces` |

### Provisioning Commands
```bash
az group create --name rg-acs-email-lab --location koreacentral

az communication create --name acs-email-lab --resource-group rg-acs-email-lab --data-location "Korea" --location global

az communication email create --name ecs-email-lab --resource-group rg-acs-email-lab --data-location "Korea" --location global

az communication email domain create --domain-name AzureManagedDomain --email-service-name ecs-email-lab --resource-group rg-acs-email-lab --location global --domain-management AzureManaged

# Link domain to ACS (REST API)
az rest --method patch \
  --url "https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/rg-acs-email-lab/providers/Microsoft.Communication/communicationServices/acs-email-lab?api-version=2023-04-01" \
  --body '{"properties":{"linkedDomains":["/subscriptions/{subscription-id}/resourceGroups/rg-acs-email-lab/providers/Microsoft.Communication/emailServices/ecs-email-lab/domains/AzureManagedDomain"]}}'

az monitor log-analytics workspace create --resource-group rg-acs-email-lab --workspace-name law-acs-email-lab --location koreacentral

az monitor diagnostic-settings create \
  --name "acs-diag-all" \
  --resource "/subscriptions/{subscription-id}/resourceGroups/rg-acs-email-lab/providers/Microsoft.Communication/communicationServices/acs-email-lab" \
  --workspace "/subscriptions/{subscription-id}/resourceGroups/rg-acs-email-lab/providers/Microsoft.OperationalInsights/workspaces/law-acs-email-lab" \
  --logs '[{"categoryGroup":"allLogs","enabled":true}]' \
  --metrics '[{"category":"AllMetrics","enabled":true}]'
```

| Command | Purpose |
|---------|---------|
| `az group create` | Creates the resource group that holds all lab resources. |
| `az communication create` | Creates the ACS resource. |
| `az communication email create` | Creates the Email Communication Service resource. |
| `az communication email domain create` | Creates the Azure-managed email domain. |
| `az rest --method patch` | Links the email domain to the ACS resource via the management REST API. |
| `--url "https://management.azure.com/.../communicationServices/acs-email-lab?api-version=2023-04-01"` | Targets the ACS resource ARM endpoint to patch. |
| `--body '{"properties":{"linkedDomains":[...]}}'` | Supplies the `linkedDomains` patch payload. |
| `az monitor log-analytics workspace create` | Creates the Log Analytics workspace for diagnostics. |
| `az monitor diagnostic-settings create` | Routes ACS logs and metrics to the workspace. |
| `--logs '[{"categoryGroup":"allLogs","enabled":true}]'` | Enables all log categories. |
| `--metrics '[{"category":"AllMetrics","enabled":true}]'` | Enables all platform metrics. |

## 3. Domain Verification
- **Domain**: `<azure-managed-domain>.azurecomm.net`
- **Sender address**: `DoNotReply@<azure-managed-domain>.azurecomm.net`

!!! success "Azure Managed Domain"
    All verification records (SPF, DKIM, DKIM2, DMARC, Domain) were auto-completed by Azure.

## 4. Email Send Tests

| # | Test | Method | Result | Message ID | Timestamp (KST) |
|---|---|---|---|---|---|
| 1 | Single plain text | `begin_send()` | ✅ Delivered | `ec61511c-95a3-4587-8697-fc4663f396c4` | 11:20:01 |
| 2 | CC recipient | TO + CC | ✅ Delivered | `950742ee-ea1e-4ee5-bb19-6fc19e3cb87b` | 11:20:13 |
| 3 | File attachment | base64 text/plain | ✅ Delivered | `f83d14a1-4293-460f-b066-c084370f30a5` | 11:20:49 |
| 4 | Rich HTML | html content | ✅ Delivered | `bfa11d8b-9f5d-480a-912b-16dbbe05d0da` | 11:21:05 |
| 5-9 | Parallel burst (5) | ThreadPoolExecutor | ✅ 5/5 Delivered | 4a4a, fcbc, 6569, d930, eb34 | ~8.4s total |

### Test Implementation Snippets

**Single Plain Text**
```python
message = {
    "content": {
        "subject": "Test Email",
        "plainText": "Hello from ACS Email!"
    },
    "recipients": {
        "to": [{"address": "recipient@example.com"}]
    },
    "senderAddress": "DoNotReply@<azure-managed-domain>.azurecomm.net"
}
```

**CC Recipient**
```python
message = {
    "content": {"subject": "CC Test", "plainText": "Testing CC functionality"},
    "recipients": {
        "to": [{"address": "recipient@example.com"}],
        "cc": [{"address": "cc-recipient@example.com"}]
    },
    "senderAddress": sender_address
}
```

**File Attachment**
```python
message = {
    "content": {"subject": "Attachment Test", "plainText": "See attached file"},
    "attachments": [
        {
            "name": "test.txt",
            "contentType": "text/plain",
            "contentInBase64": "SGVsbG8gV29ybGQ="
        }
    ],
    "recipients": {"to": [{"address": "recipient@example.com"}]},
    "senderAddress": sender_address
}
```

**Rich HTML**
```python
message = {
    "content": {
        "subject": "HTML Test",
        "html": "<html><h1>Hello</h1><p>This is a rich HTML test.</p></html>"
    },
    "recipients": {"to": [{"address": "recipient@example.com"}]},
    "senderAddress": sender_address
}
```

**Parallel Burst**
```python
with ThreadPoolExecutor(max_workers=5) as executor:
    futures = [executor.submit(client.begin_send, message) for _ in range(5)]
    results = [f.result() for f in futures]
```

## 5. Delivery Confirmation via Log Analytics
The `ACSEmailStatusUpdateOperational` table was used to track delivery status.

| Column | Type | Description |
|---|---|---|
| CorrelationId | string | Maps to the SDK message ID; used to correlate `ACSEmailSendMailOperational` and `ACSEmailStatusUpdateOperational` events. |
| RecipientId | string | Per-recipient email address. Empty on message-level rows (e.g., `Dropped`, `OutForDelivery`) and populated on recipient-level rows (e.g., `Delivered`, `Bounced`). |
| DeliveryStatus | string | Status progression (`Delivered`, `Bounced`, `Failed`, `OutForDelivery`, etc.). |
| SenderDomain | string | Verified sender domain (part after `@` in the sender address). |
| SmtpStatusCode | string | SMTP status code returned by the recipient mail server. |
| EnhancedSmtpStatusCode | string | Enhanced SMTP status code for finer-grained diagnostics. |
| IsHardBounce | string | String flag (documented type per Microsoft Learn); populated for `Bounced` status only. See [Delivery Status KQL](../../troubleshooting/kql/email/delivery-status.md) for how to compare against it in queries. |

!!! info "Observation"
    All 9 test emails reached `Delivered` status. Each email generated 3-4 log events tracking status transitions from submission to final delivery.

## 6. KQL Queries Used

**Query 1 - Delivery Status Summary**
```kusto
ACSEmailStatusUpdateOperational
| where TimeGenerated > ago(1h)
| where DeliveryStatus != ""
| summarize Count = count() by DeliveryStatus
| sort by Count desc
```
*Result: OutForDelivery: 9, Delivered: 9*

**Query 2 - Per-Message Lifecycle**
```kusto
ACSEmailStatusUpdateOperational
| summarize StatusChanges = count(), FirstEvent = min(TimeGenerated), LastEvent = max(TimeGenerated) by CorrelationId
| extend DurationSec = datetime_diff("second", LastEvent, FirstEvent)
| sort by FirstEvent asc
```
*Result: Duration 3-6 seconds per message*

**Query 3 - Delivery Confirmation Details**
```kusto
ACSEmailStatusUpdateOperational
| where DeliveryStatus == "Delivered"
| where isnotempty(RecipientId)
| project TimeGenerated, CorrelationId, RecipientId, SenderDomain, SenderUsername
| sort by TimeGenerated asc
```
*Result: All 9 recipient-level `Delivered` rows recorded; `RecipientId` `@`-suffix confirms gmail.com recipients.*

## 7. Key Findings
- **Zero Configuration**: Azure Managed Domain required no manual DNS configuration.
- **CLI Limitation**: Domain linking via CLI was not available; REST API patch was required.
- **Performance**: Parallel sends (5 concurrent) completed in ~8.4 seconds total.
- **Log Ingestion**: Log Analytics ingestion delay was less than 5 minutes.
- **Latency**: The end-to-end email lifecycle (submit to Delivered) took 3-6 seconds.
- **SDK Behavior**: Python SDK version 1.1.0 `begin_send()` returns a poller; calling `.result()` blocks until terminal status.

## 8. See Also
- [Send Email Tutorial](../../sdk-guides/python/tutorial/03-send-email.md)
- [Email Delivery Status KQL](../../troubleshooting/kql/email/delivery-status.md)
- [Monitoring](../../operations/monitoring.md)
