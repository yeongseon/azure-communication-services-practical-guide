---
title: Logging and Monitoring
description: Configuring logging and monitoring for Azure Communication Services with Python.
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/logging-and-diagnostics
---

# Logging and Monitoring

This step covers how to monitor your Azure Communication Services (ACS) resource and configure SDK logging in Python.

## 1. SDK Logging Configuration

The ACS Python SDK uses the standard `logging` library. You can configure it to output logs to the console or a file.

```python
import logging
import sys

# Configure logging to output to console
handler = logging.StreamHandler(stream=sys.stdout)
logger = logging.getLogger('azure.communication')
logger.setLevel(logging.DEBUG)
logger.addHandler(handler)

# Use ACS client as usual
from azure.communication.identity import CommunicationIdentityClient
# ...
```

## 2. Azure Monitor Integration

ACS is integrated with Azure Monitor. You can view metrics and logs in the Azure Portal.

1. Navigate to your ACS resource.
2. Under **Monitoring**, select **Metrics**.
3. Choose a metric, such as **SMS Sent** or **Email Sent**.
4. You can also create **Alerts** based on these metrics.

## 3. Application Insights Setup

To get deeper insights into your Python application's performance and dependencies, integrate with Azure Application Insights.

```bash
pip install opencensus-ext-azure opencensus-ext-flask
```

```python
import logging
from opencensus.ext.azure.log_exporter import AzureLogHandler

logger = logging.getLogger(__name__)
logger.addHandler(AzureLogHandler(connection_string='InstrumentationKey=<your-instrumentation-key>'))

logger.warning("Monitoring ACS operation performance.")
```

## 4. Custom Telemetry for ACS Operations

You can add custom telemetry to track specific ACS operations, such as the time it takes to send an email or handle a call.

```python
import time
from opencensus.stats import stats as stats_module
from opencensus.stats import measure as measure_module
from opencensus.stats import view as view_module

# Define measure and view
m_email_latency = measure_module.MeasureFloat("email_latency", "Latency of email sends", "ms")
v_email_latency = view_module.View("email_latency_view", "Email latency view", [], m_email_latency, view_module.DistributionAggregation([10, 50, 100, 200, 500, 1000]))

# Register view
stats_module.stats_recorder.new_view_manager().register_view(v_email_latency)

# Record telemetry
start_time = time.time()
# send_email_op()
latency = (time.time() - start_time) * 1000
stats_module.stats_recorder.new_measurement_map().measure_float_put(m_email_latency, latency).record()
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
