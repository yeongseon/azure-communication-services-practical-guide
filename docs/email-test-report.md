---
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---

---
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

## 3. Domain Verification
- **Domain**: `fc135b5e-3353-4c89-9edb-55b53b59215f.azurecomm.net`
- **Sender address**: `DoNotReply@fc135b5e-3353-4c89-9edb-55b53b59215f.azurecomm.net`

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
    "senderAddress": "DoNotReply@fc135b5e-3353-4c89-9edb-55b53b59215f.azurecomm.net"
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
| CorrelationId | string | Maps to SDK message ID |
| DeliveryStatus | string | Status progression |
| RecipientMailServerHostName | string | Target mail server |
| SenderDomain | string | Verified sender domain |
| IsHardBounce | string | Bounce classification |

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
| project TimeGenerated, CorrelationId, RecipientMailServerHostName, SenderDomain, SenderUsername
| sort by TimeGenerated asc
```
*Result: All 9 delivered to gmail-smtp-in.l.google.com*

## 7. Key Findings
- **Zero Configuration**: Azure Managed Domain required no manual DNS configuration.
- **CLI Limitation**: Domain linking via CLI was not available; REST API patch was required.
- **Performance**: Parallel sends (5 concurrent) completed in ~8.4 seconds total.
- **Log Ingestion**: Log Analytics ingestion delay was less than 5 minutes.
- **Latency**: The end-to-end email lifecycle (submit to Delivered) took 3-6 seconds.
- **SDK Behavior**: Python SDK version 1.1.0 `begin_send()` returns a poller; calling `.result()` blocks until terminal status.

## 8. See Also
- [Send Email Tutorial](sdk-guides/python/tutorial/03-send-email.md)
- [Email Delivery Status KQL](troubleshooting/kql/email/delivery-status.md)
- [Monitoring](operations/monitoring.md)
