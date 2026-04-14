---
hide: [toc]
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/logging-and-diagnostics
---

# Troubleshooting Map for ACS

The Troubleshooting Map is a visual decision tree to help you diagnose and resolve common communication issues in Azure Communication Services (ACS).

<!-- diagram-id: troubleshooting-map-diagram -->
```mermaid
graph TD
    Start[Troubleshoot ACS Issue] --> Channel[Identify Channel]
    
    Channel --> SMS[SMS Issue]
    Channel --> Email[Email Issue]
    Channel --> Chat[Chat Issue]
    Channel --> Calling[Calling Issue]
    
    SMS --> SmsDeliv[SMS Delivery Failure]
    SmsDeliv --> SmsCheck[Check Delivery Status]
    SmsCheck --> SmsLog[Analyze ACS SMS Logs]
    
    Email --> EmailDeliv[Email Delivery Failure]
    EmailDeliv --> EmailCheck[Check Email Logs]
    EmailCheck --> EmailLog[Analyze ACS Email Logs]
    
    Chat --> ChatLat[Chat Message Latency]
    ChatLat --> ChatLog[Analyze ACS Chat Logs]
    
    Calling --> CallQual[Poor Call Quality]
    CallQual --> CallLog[Analyze ACS Calling Logs]
```

## Interactive Troubleshooting Map

The following section will host an interactive troubleshooting map for a step-by-step diagnostic journey.

<div id="troubleshooting-map" style="height: 600px; border: 1px solid #ccc;">
  <!-- Placeholder for interactive troubleshooting map div -->
</div>

## See Also
- [Log Analytics and Kusto queries](https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-tutorial)
- [How to: Use KQL for ACS troubleshooting](https://learn.microsoft.com/azure/communication-services/concepts/logging-and-diagnostics)

## Sources
- [ACS Documentation](https://learn.microsoft.com/azure/communication-services/)
