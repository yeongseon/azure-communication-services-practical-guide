---
content_sources:
  diagrams:
    - id: main-decision-tree
      type: flowchart
      source: self-generated
      justification: Original symptom-routing decision tree that directs ACS communication issues to the appropriate specialized playbook.
    - id: sms-sub-tree
      type: flowchart
      source: self-generated
      justification: Original decision sub-tree for SMS delivery and provisioning failures.
    - id: calling-sub-tree
      type: flowchart
      source: self-generated
      justification: Original decision sub-tree for Calling and Video quality and connection failures.
---

# Troubleshooting Decision Tree

This comprehensive guide helps you route symptoms to the appropriate troubleshooting playbook.

## Symptom Routing

<!-- diagram-id: main-decision-tree -->
```mermaid
graph TD
    Start[Symptom] --> Messaging[Messaging]
    Start --> Calling[Calling / Video]
    Start --> Teams[Teams Interop]
    
    Messaging --> SMS[SMS]
    Messaging --> Email[Email]
    Messaging --> Chat[Chat]
    
    SMS --> SMS_Del[Delivery Failure?]
    SMS --> SMS_Opt[Opt-out/in?]
    SMS --> SMS_Rate[429 Throttling?]
    
    Email --> Em_Del[Bounced/Not Delivered?]
    Email --> Em_Ver[Domain Verification Fail?]
    Email --> Em_Spam[Landing in Spam?]
    
    Chat --> Ch_Del[Messages Not Arriving?]
    Chat --> Ch_Thr[Thread Access Issues?]
    Chat --> Ch_Not[Real-time Notifications?]
    
    Calling --> Cal_Qual[Poor Audio/Video?]
    Calling --> Cal_Drop[Calls Disconnecting?]
    Calling --> Cal_Conn[Cannot Connect at all?]
    
    Teams --> Tea_Join[Cannot Join Meeting?]
    Teams --> Tea_Perm[Missing Features/Permissions?]
```

## SMS Routing Sub-tree

<!-- diagram-id: sms-sub-tree -->
```mermaid
graph TD
    Symptom[SMS Issues] --> Status{Delivery Status?}
    Status -- Fail --> Reason{Reason?}
    Reason -- Opt-out --> OptOut[Opt-out Handling]
    Reason -- Throttled --> RateLimit[Rate Limiting]
    Reason -- Undelivered --> DelFail[Delivery Failures]
```

## Calling Routing Sub-tree

<!-- diagram-id: calling-sub-tree -->
```mermaid
graph TD
    Symptom[Voice/Video Issues] --> Stage{When does it fail?}
    Stage -- Setup --> ConnFail[Connection Failures]
    Stage -- During Call --> Drop[Call Drops]
    Stage -- Ongoing --> Quality[Call Quality]
```

## See Also
* [Top-level Troubleshooting Overview](index.md)
* [Evidence Map](evidence-map.md)

## Sources
* Azure Communication Services Documentation
* Troubleshooting Support Framework
