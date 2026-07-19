---
title: Event Grid Webhooks
description: Handling Azure Communication Services events with JavaScript webhooks.
content_sources:
  - https://learn.microsoft.com/azure/event-grid/receive-events?pivots=programming-language-javascript
---

# Event Grid Webhooks

This recipe demonstrates how to set up an Azure Event Grid subscription for Azure Communication Services (ACS) and handle events using a JavaScript web framework like Express.

## Prerequisites

- [ACS Resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- [Event Grid Subscription](https://learn.microsoft.com/azure/event-grid/overview).
- [JavaScript Web Server](https://expressjs.com/) (e.g., Express, Fastify).

## 1. Set Up Event Grid Subscription

```bash
# Create an Event Grid subscription for ACS
az eventgrid event-subscription create \
  --name "acs-sms-subscription" \
  --source-resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Communication/CommunicationServices/<acs-resource-name>" \
  --endpoint "https://<your-webhook-endpoint>/api/webhooks" \
  --endpoint-type webhook \
  --included-event-types "Microsoft.Communication.SMSReceived" "Microsoft.Communication.SMSDeliveryReportReceived"
```

| Command | Purpose |
|---------|---------|
| `az eventgrid event-subscription create` | Creates an Event Grid subscription that forwards ACS events to an endpoint. |
| `--name "acs-sms-subscription"` | Names the event subscription. |
| `--source-resource-id "/subscriptions/.../CommunicationServices/<acs-resource-name>"` | Sets the ACS resource as the event source (full ARM resource ID). |
| `--endpoint "https://<your-webhook-endpoint>/api/webhooks"` | Sets the webhook URL that receives events. |
| `--endpoint-type webhook` | Declares the endpoint as an HTTP webhook. |
| `--included-event-types "Microsoft.Communication.SMSReceived" "..."` | Filters delivery to the listed ACS SMS event types. |

## 2. Express Webhook Endpoint

Implement an endpoint to receive and process events. You must handle the `SubscriptionValidationEvent` to successfully register the webhook.

```javascript
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/api/webhooks", (req, res) => {
    const events = req.body;
    
    for (const event of events) {
        // Handle subscription validation event
        if (event.eventType === "Microsoft.EventGrid.SubscriptionValidationEvent") {
            const validationCode = event.data.validationCode;
            return res.status(200).send({ validationResponse: validationCode });
        }
            
        // Handle SMS received event
        if (event.eventType === "Microsoft.Communication.SMSReceived") {
            const sender = event.data.from;
            const message = event.data.message;
            console.log(`Received SMS from ${sender}: ${message}`);
        }
            
        // Handle Email delivered event
        if (event.eventType === "Microsoft.Communication.EmailDeliveryReportReceived") {
            const messageId = event.data.messageId;
            const status = event.data.status;
            console.log(`Email delivery status for ${messageId}: ${status}`);
        }
    }

    return res.status(200).send("OK");
});

app.listen(5000, () => console.log("Webhook server listening on port 5000"));
```

## 3. Validate CloudEvents

For improved interoperability, use the `@azure/eventgrid` library to validate and parse CloudEvents.

```bash
npm install @azure/eventgrid
```

```javascript
const { EventGridConsumerClient } = require("@azure/eventgrid");

// Assuming the incoming request is in CloudEvent format
async function processCloudEvent(rawEvent) {
    const consumer = new EventGridConsumerClient();
    const event = consumer.deserialize(rawEvent);
    console.log(`Processing event of type: ${event.eventType}`);
}
```

## 4. Handle Common ACS Events

ACS provides several event types you can subscribe to:

| Event Type | Description |
| --- | --- |
| `Microsoft.Communication.SMSReceived` | Triggered when a message is received at a phone number. |
| `Microsoft.Communication.SMSDeliveryReportReceived` | Triggered when a delivery report is received for an outbound SMS. |
| `Microsoft.Communication.EmailDeliveryReportReceived` | Triggered when a delivery report is received for an email. |
| `Microsoft.Communication.ChatMessageReceived` | Triggered when a new message is sent to a chat thread. |

## See Also
- [ACS Event Schema](https://learn.microsoft.com/azure/event-grid/event-schema-communication-services)
- [Event Grid Webhook Validation](https://learn.microsoft.com/azure/event-grid/webhook-event-delivery)

## Sources
- [Handle events in Azure Communication Services](https://learn.microsoft.com/azure/communication-services/concepts/event-grid/handle-events)
