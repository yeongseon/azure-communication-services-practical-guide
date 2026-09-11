---
title: "Step 4: Chat"
description: Implement real-time chat with the Azure Communication Services Java SDK.
content_sources:
  diagrams:
    - id: java-tutorial-chat-flow
      type: flowchart
      source: mslearn-adapted
      based_on:
        - https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/chat/get-started
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

# Step 4: Chat

Learn how to create chat threads, add participants, and send messages.

This tutorial walks these steps in order:

<!-- diagram-id: java-tutorial-chat-flow -->
```mermaid
flowchart TD
    START["Step 4: Chat"]
    N1["1. Add Chat Dependency"]
    N2["2. Initialize ChatClient"]
    N3["3. Create a Chat Thread"]
    N4["4. Send and Receive Messages"]
    N5["5. Manage Participants"]
    N6["Full Code Example"]
    START --> N1
    N1 --> N2
    N2 --> N3
    N3 --> N4
    N4 --> N5
    N5 --> N6
```

## 1. Add Chat Dependency

Add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-chat</artifactId>
    <version>1.3.0</version>
</dependency>
```

## 2. Initialize ChatClient

Chat operations require a User Access Token (generated in Step 1).

```java
import com.azure.communication.chat.ChatClient;
import com.azure.communication.chat.ChatClientBuilder;
import com.azure.communication.common.CommunicationTokenCredential;

String endpoint = "https://<your-resource>.communication.azure.com";
String userAccessToken = "<user-access-token>";

ChatClient chatClient = new ChatClientBuilder()
    .endpoint(endpoint)
    .credential(new CommunicationTokenCredential(userAccessToken))
    .buildClient();
```

## 3. Create a Chat Thread

Threads are the containers for messages and participants.

```java
import com.azure.communication.chat.models.*;
import java.util.Arrays;

public void createThread() {
    CreateChatThreadOptions options = new CreateChatThreadOptions("General Support")
        .addParticipant(new ChatParticipant()
            .setCommunicationIdentifier(new CommunicationUserIdentifier("<second-user-id>"))
            .setDisplayName("Jane Doe"));

    CreateChatThreadResult result = chatClient.createChatThread(options);
    String threadId = result.getChatThread().getId();
    System.out.println("Thread created with ID: " + threadId);
}
```

## 4. Send and Receive Messages

Use `ChatThreadClient` for operations within a specific thread.

```java
import com.azure.communication.chat.ChatThreadClient;

public void sendMessage(String threadId) {
    ChatThreadClient threadClient = chatClient.getChatThreadClient(threadId);
    
    SendChatMessageOptions options = new SendChatMessageOptions()
        .setContent("Hello everyone!")
        .setType(ChatMessageType.TEXT);

    SendChatMessageResult result = threadClient.sendMessage(options);
    System.out.println("Message sent with ID: " + result.getId());
}

public void listMessages(String threadId) {
    ChatThreadClient threadClient = chatClient.getChatThreadClient(threadId);
    
    threadClient.listMessages().iterableByPage().forEach(page -> {
        page.getElements().forEach(message -> {
            System.out.println(message.getSenderDisplayName() + ": " + message.getContent().getMessage());
        });
    });
}
```

## 5. Manage Participants

```java
public void addParticipant(String threadId, String userId) {
    ChatThreadClient threadClient = chatClient.getChatThreadClient(threadId);
    
    ChatParticipant participant = new ChatParticipant()
        .setCommunicationIdentifier(new CommunicationUserIdentifier(userId))
        .setDisplayName("New Member");

    threadClient.addParticipants(Arrays.asList(participant));
}
```

## Full Code Example

```java
package com.communication.quickstart;

import com.azure.communication.chat.*;
import com.azure.communication.chat.models.*;
import com.azure.communication.common.*;

public class ChatApp {
    public static void main(String[] args) {
        // Initialize client, create thread, and send message
        // Ensure you have valid endpoint and token
    }
}
```

## Next Step

Implement voice features with [Voice Calling](./05-voice-calling.md).

## See Also
- [03. Send Email](./03-send-email.md)
- [05. Voice Calling](./05-voice-calling.md)
- [Tutorial Index](./index.md)
- [Java Recipes](../recipes/index.md)

## Sources
- [Quickstart: Join a chat thread](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/chat/get-started)
