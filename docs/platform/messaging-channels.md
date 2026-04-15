---
content_sources:
  diagrams:
    - id: messaging-channels-architecture
      type: self-generated
      justification: Messaging channels architecture overview
---

# Messaging Channels Overview

Azure Communication Services (ACS) provides multiple channels for asynchronous and real-time messaging. Each channel is designed for specific use cases, ranging from high-volume transactional notifications to interactive customer support chats.

## Messaging Channels Comparison

| Feature | SMS | Email | Chat |
| --- | --- | --- | --- |
| **Primary Use Case** | Urgent alerts, MFA, marketing | Invoices, reports, newsletters | Customer support, internal collaboration |
| **Persistence** | Device-dependent | Inbox-dependent | Server-side (stored in ACS) |
| **Real-time** | Near real-time | Low-to-moderate latency | Instant (via WebSockets) |
| **Formatting** | Plain text (mostly) | Rich HTML / Attachments | Plain text, Emoji, Attachments |
| **Capacity** | High volume (Short codes) | Very high (Transactional) | Threads / Large groups |

## SMS Channel

ACS allows you to send and receive text messages globally. To use the SMS channel, you must acquire a phone number within your Communication Resource.

### Key Capabilities
-   **Toll-Free Numbers**: Ideal for high-volume messages and two-way communication.
-   **Short Codes**: Specialized numbers for massive transactional or promotional campaigns.
-   **MMS Support**: Send and receive multimedia content (images, video).
-   **Delivery Status**: Real-time tracking of sent messages via Event Grid.

## Email Channel

The ACS Email channel provides a high-reliability platform for transactional emails.

### Key Capabilities
-   **Azure Managed Domains**: Instant setup using `donotreply@xxxx.azurecomm.net`.
-   **Custom Domains**: Verified domains with SPF, DKIM, and DMARC support for high deliverability.
-   **Batch Sending**: API-optimized for sending messages to thousands of recipients.
-   **Tracking**: Support for delivery, bounce, and click tracking.

## Chat Channel

The Chat channel enables real-time messaging between users in chat "threads".

### Key Capabilities
-   **Thread Management**: Create, update, and delete threads with up to 250 participants.
-   **Real-time Notifications**: Uses WebSockets to deliver messages instantly to active clients.
-   **Read Receipts & Typing Indicators**: Standard modern chat features built-in.
-   **History Retrieval**: Access to previous messages within a thread.

## Messaging Architecture Diagram

The following diagram illustrates how your application interacts with different messaging channels via ACS.

<!-- diagram-id: messaging-channels-architecture -->
```mermaid
graph TD
    App[Application Server] -- "REST / SDK" --> ACS[Azure Communication Services]
    
    ACS -- "Twilio/Telco" --> SMS[SMS Channel]
    ACS -- "MTA / SMTP" --> Email[Email Channel]
    ACS -- "WebSockets" --> Chat[Chat Channel]
    
    SMS --> Mobile[Mobile User]
    Email --> Inbox[Email User]
    Chat --> Browser[Web/Mobile App]
    
    ACS -- "Events" --> EventGrid[Azure Event Grid]
    EventGrid -.-> Callback[App Callback / Log]
```

!!! tip "Hybrid Messaging"
    Many applications use a hybrid approach: sending a real-time **Chat** message first and falling back to **SMS** if the user is offline for more than 5 minutes (via Event Grid monitoring).

## See Also

- [Resource Types](resource-types.md)
- [Event Handling](event-handling.md)

## Sources

- [SMS Overview](https://learn.microsoft.com/azure/communication-services/concepts/sms/overview)
- [Email Overview](https://learn.microsoft.com/azure/communication-services/concepts/email/overview)
- [Chat Concepts](https://learn.microsoft.com/azure/communication-services/concepts/chat/concepts)
