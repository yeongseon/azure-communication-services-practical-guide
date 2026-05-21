---
title: Logging and Monitoring
description: Configuring logging and monitoring for Azure Communication Services with JavaScript.
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/logging-and-diagnostics
validation:
  az_cli:
    last_tested: null
    result: not_tested
  bicep:
    last_tested: null
    result: not_tested
---

# Logging and Monitoring

This step covers how to monitor your Azure Communication Services (ACS) resource and configure SDK logging in JavaScript.

## 1. SDK Logging Configuration (Node.js)

The ACS JavaScript SDK uses the `@azure/logger` package. You can configure it to output logs to the console.

```bash
npm install @azure/logger
```

```javascript
const { setLogLevel } = require("@azure/logger");

// Set the log level
setLogLevel("info");

// Use ACS client as usual
const { CommunicationIdentityClient } = require("@azure/communication-identity");
// ...
```

## 2. Browser SDK Logging

In the browser, you can capture logs from the Calling and Chat SDKs.

```javascript
import { setLogLevel } from "@azure/logger";

// Capture logs in the browser console
setLogLevel("verbose");

// You can also redirect logs to a custom function
setLogLevel("info", (message) => {
    console.log(`[ACS Log]: ${message}`);
});
```

## 3. Azure Monitor Integration

ACS is integrated with Azure Monitor. You can view metrics and logs in the Azure Portal.

1. Navigate to your ACS resource.
2. Under **Monitoring**, select **Metrics**.
3. Choose a metric, such as **SMS Sent** or **Email Sent**.
4. You can also create **Alerts** based on these metrics.

## 4. Application Insights Setup (Node.js)

To get deeper insights into your Node.js application's performance and dependencies, integrate with Azure Application Insights.

```bash
npm install applicationinsights
```

```javascript
const appInsights = require("applicationinsights");
appInsights.setup("<your-instrumentation-key>").start();

const client = appInsights.defaultClient;
client.trackTrace({ message: "Monitoring ACS operation performance." });
```

## 5. Diagnostic Settings

To store logs for long-term analysis, configure diagnostic settings.

1. Navigate to your ACS resource.
2. Under **Monitoring**, select **Diagnostic settings**.
3. Click **Add diagnostic setting**.
4. Select the logs you want to collect (e.g., **SMS Operational Logs**, **Email Operational Logs**).
5. Choose a destination, such as a **Log Analytics workspace**.

## 6. KQL Queries for Monitoring

Once your logs are in a Log Analytics workspace, you can query them using Kusto Query Language (KQL).

### SMS Sent Summary

```kusto
ACSSmsOperational
| where OperationName == "SmsSend"
| summarize Count=count() by ResultType, ResultSignature, bin(TimeGenerated, 1h)
| render timechart
```

### Email Delivery Success Rate

```kusto
ACSEmailOperational
| where OperationName == "EmailSend"
| summarize SuccessCount=countif(ResultType == "Succeeded"), TotalCount=count()
| extend SuccessRate = (SuccessCount * 100.0) / TotalCount
```

## See Also
- [ACS Metrics](https://learn.microsoft.com/azure/communication-services/concepts/metrics)
- [ACS Logs](https://learn.microsoft.com/azure/communication-services/concepts/logs)

## Sources
- [Azure Monitor for Azure Communication Services](https://learn.microsoft.com/azure/communication-services/concepts/logging-and-diagnostics)
