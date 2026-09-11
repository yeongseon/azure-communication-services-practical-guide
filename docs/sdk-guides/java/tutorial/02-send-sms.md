---
title: "Step 2: Send SMS"
description: Learn how to send SMS messages using the Azure Communication Services Java SDK.
content_sources:
  diagrams:
    - id: java-tutorial-send-sms-flow
      type: flowchart
      source: mslearn-adapted
      based_on:
        - https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/sms/send
validation:
  az_cli:
    last_tested: null
    cli_version: null
    sdk_version: null
    result: not_tested
  bicep:
    last_tested: null
    result: not_tested
---

# Step 2: Send SMS

In this step, you will use the `SmsClient` to send text messages.

This tutorial walks these steps in order:

<!-- diagram-id: java-tutorial-send-sms-flow -->
```mermaid
flowchart TD
    START["Step 2: Send SMS"]
    N1["1. Add SMS Dependency"]
    N2["2. Initialize SmsClient"]
    N3["3. Send a Single SMS"]
    N4["4. Send with Options (Delivery Reports)"]
    N5["5. Error Handling"]
    N6["Full Code Example"]
    START --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
```

## 1. Add SMS Dependency

Add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-sms</artifactId>
    <version>1.1.0</version>
</dependency>
```

## 2. Initialize SmsClient

You can initialize the client using your connection string.

```java
import com.azure.communication.sms.SmsClient;
import com.azure.communication.sms.SmsClientBuilder;

String connectionString = System.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING");
SmsClient smsClient = new SmsClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

## 3. Send a Single SMS

To send a message, you need a phone number acquired through ACS or a verified number (depending on region).

```java
import com.azure.communication.sms.models.SmsSendResult;
import java.util.ArrayList;
import java.util.List;

public void sendSingleSms() {
    SmsSendResult result = smsClient.send(
        "<from-phone-number>", // Your ACS phone number
        "<to-phone-number>",   // Recipient number in E.164 format
        "Hello from the Java SDK Tutorial!"
    );

    System.out.println("Message ID: " + result.getMessageId());
    System.out.println("Status: " + result.getHttpStatusCode());
}
```

## 4. Send with Options (Delivery Reports)

You can enable delivery reports by passing `SmsSendOptions`.

```java
import com.azure.communication.sms.models.SmsSendOptions;

public void sendSmsWithOptions() {
    SmsSendOptions options = new SmsSendOptions();
    options.setEnableDeliveryReport(true);
    options.setTag("marketing-campaign");

    SmsSendResult result = smsClient.send(
        "<from-phone-number>",
        "<to-phone-number>",
        "Check out our new summer deals!",
        options
    );
    
    System.out.println("Sent with delivery reporting enabled.");
}
```

## 5. Error Handling

Wrap your calls in try-catch blocks to handle `HttpResponseException`.

```java
import com.azure.core.exception.HttpResponseException;

try {
    smsClient.send(from, to, message);
} catch (HttpResponseException e) {
    System.err.println("Failed to send SMS. Status code: " + e.getResponse().getStatusCode());
    System.err.println("Error message: " + e.getMessage());
}
```

## Full Code Example

```java
package com.communication.quickstart;

import com.azure.communication.sms.SmsClient;
import com.azure.communication.sms.SmsClientBuilder;
import com.azure.communication.sms.models.SmsSendResult;

public class SmsApp {
    public static void main(String[] args) {
        String connectionString = System.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING");
        SmsClient smsClient = new SmsClientBuilder()
            .connectionString(connectionString)
            .buildClient();

        SmsSendResult result = smsClient.send(
            "<your-acs-number>",
            "<recipient-number>",
            "Hello from Java!"
        );

        System.out.println("Message sent. ID: " + result.getMessageId());
    }
}
```

## Next Step

Learn how to [Send Email](./03-send-email.md).

## See Also
- [01. Local Setup](./01-local-setup.md)
- [03. Send Email](./03-send-email.md)
- [Tutorial Index](./index.md)
- [Java Recipes](../recipes/index.md)

## Sources
- [Quickstart: Send an SMS message](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/sms/send)
