---
title: Event Grid Webhooks with Spring Boot
description: Handle Azure Communication Services events using a Spring Boot webhook.
hide:
  - toc
---

# Event Grid Webhooks with Spring Boot

Azure Communication Services publishes events (like SMS received or call ended) to Azure Event Grid. You can handle these events using a webhhok.

## 1. Create Spring Boot Controller

Use a `@RestController` to receive events. Event Grid sends a validation event when you first register the webhook.

```java
import com.azure.messaging.eventgrid.EventGridEvent;
import com.azure.messaging.eventgrid.systemevents.SubscriptionValidationEventData;
import com.azure.messaging.eventgrid.systemevents.SubscriptionValidationResponse;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class WebhookController {

    @PostMapping
    public Object handleEvent(@RequestBody List<EventGridEvent> events) {
        for (EventGridEvent event : events) {
            // 1. Handle Validation Event
            if (event.getEventType().equals("Microsoft.EventGrid.SubscriptionValidationEvent")) {
                SubscriptionValidationEventData data = event.getData().toObject(SubscriptionValidationEventData.class);
                return new SubscriptionValidationResponse().setValidationResponse(data.getValidationCode());
            }

            // 2. Handle ACS Events (e.g., SMS Received)
            if (event.getEventType().equals("Microsoft.Communication.SMSReceived")) {
                Map<String, Object> data = event.getData().toObject(Map.class);
                System.out.println("SMS Received: " + data.get("message"));
            }
        }
        return "Event Processed";
    }
}
```

## 2. Configure Event Grid Subscription

1.  Deploy your Spring Boot app to a public URL (e.g., Azure App Service).
2.  In the Azure Portal, go to your ACS resource.
3.  Select **Events** > **+ Event Subscription**.
4.  Set **Endpoint Type** to **Web Hook**.
5.  Set **Endpoint** to `https://your-app.com/api/events`.

## 3. Local Testing

Use **ngrok** to expose your local server for testing:

```bash
ngrok http 8080
```

Update your Event Subscription to use the ngrok URL.

## Sources
- [Handle Azure Communication Services events](https://learn.microsoft.com/azure/communication-services/concepts/event-handling)
- [Event Grid library for Java](https://learn.microsoft.com/java/api/overview/azure/messaging-eventgrid-readme)
