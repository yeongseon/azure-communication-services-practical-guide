---
title: "Step 5: Voice Calling"
description: Build telephony applications with Call Automation and the Java SDK.
content_sources:
  diagrams:
    - id: java-tutorial-voice-calling-flow
      type: flowchart
      source: mslearn-adapted
      based_on:
        - https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/call-automation/quickstart-make-an-outbound-call
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

# Step 5: Voice Calling

Use the `CallAutomationClient` to make outbound calls and handle telephony events.

This tutorial walks these steps in order:

<!-- diagram-id: java-tutorial-voice-calling-flow -->
```mermaid
flowchart TD
    START[""Step 5: Voice Calling""]
    N1["1. Add Call Automation Dependency"]
    N2["2. Initialize CallAutomationClient"]
    N3["3. Make an Outbound PSTN Call"]
    N4["4. Play Audio Prompts"]
    N5["5. DTMF Recognition (Interactive Voice Response)"]
    N6["Full Code Example"]
    START --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
```

## 1. Add Call Automation Dependency

Add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-callautomation</artifactId>
    <version>1.0.0</version>
</dependency>
```

## 2. Initialize CallAutomationClient

```java
import com.azure.communication.callautomation.CallAutomationClient;
import com.azure.communication.callautomation.CallAutomationClientBuilder;

String connectionString = System.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING");
CallAutomationClient callClient = new CallAutomationClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

## 3. Make an Outbound PSTN Call

You need an ACS phone number and a callback URL to receive events.

```java
import com.azure.communication.callautomation.models.*;
import com.azure.communication.common.PhoneNumberIdentifier;

public void makeCall() {
    PhoneNumberIdentifier target = new PhoneNumberIdentifier("+1234567890");
    PhoneNumberIdentifier caller = new PhoneNumberIdentifier("+10987654321");
    String callbackUrl = "https://your-app.com/callbacks/call";

    CallInvite invite = new CallInvite(target, caller);
    CreateCallResult result = callClient.createCall(invite, callbackUrl);
    
    System.out.println("Call Connection ID: " + result.getCallConnectionProperties().getCallConnectionId());
}
```

## 4. Play Audio Prompts

Once the call is established, you can play audio files to the participant.

```java
import com.azure.communication.callautomation.CallConnection;

public void playAudio(String callConnectionId) {
    CallConnection callConnection = callClient.getCallConnection(callConnectionId);
    
    FileSource audioSource = new FileSource().setUrl("https://storage.com/welcome.wav");
    PlayOptions options = new PlayOptions(audioSource, Arrays.asList(new PhoneNumberIdentifier("+1234567890")));

    callConnection.getCallMedia().play(options);
}
```

## 5. DTMF Recognition (Interactive Voice Response)

Recognize keypad inputs from the user.

```java
public void startRecognition(String callConnectionId) {
    CallConnection callConnection = callClient.getCallConnection(callConnectionId);
    
    DtmfConfigurations config = new DtmfConfigurations()
        .setMaxDigitsToCollect(1)
        .setInterDigitTimeoutInSeconds(5);

    CallMediaRecognizeDtmfOptions options = new CallMediaRecognizeDtmfOptions(
        new PhoneNumberIdentifier("+1234567890"), 1)
        .setInterDigitTimeout(Duration.ofSeconds(5));

    callConnection.getCallMedia().startRecognizing(options);
}
```

## Full Code Example

```java
package com.communication.quickstart;

import com.azure.communication.callautomation.*;
import com.azure.communication.callautomation.models.*;
import com.azure.communication.common.*;

public class VoiceApp {
    public static void main(String[] args) {
        // Implementation for outbound call and event handling
    }
}
```

## Next Step

Implement [Logging & Monitoring](./06-logging-monitoring.md) for your application.

## See Also
- [04. Chat](./04-chat.md)
- [06. Logging & Monitoring](./06-logging-monitoring.md)
- [Tutorial Index](./index.md)
- [Java Recipes](../recipes/index.md)

## Sources
- [Quickstart: Make an outbound call using Call Automation](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/call-automation/quickstart-make-an-outbound-call)
