---
title: Real-time Chat
description: Building real-time chat features with Azure Communication Services for JavaScript.
content_sources:
  - https://learn.microsoft.com/azure/communication-services/quickstarts/chat/get-started?pivots=programming-language-javascript
validation:
  az_cli:
    last_tested: null
    result: not_tested
  bicep:
    last_tested: null
    result: not_tested
---

# Real-time Chat

This step demonstrates how to build real-time chat features using the Azure Communication Services (ACS) JavaScript SDK.

## 1. Prerequisites

- Complete the [Local Setup](./01-local-setup.md).
- Have an ACS user identity and access token with 'chat' scope.

## 2. ChatClient Setup

Initialize the `ChatClient` using the ACS endpoint and an access token.

```javascript
const { ChatClient } = require("@azure/communication-chat");
const { AzureKeyCredential } = require("@azure/core-auth");

const endpoint = process.env.COMMUNICATION_SERVICES_ENDPOINT;
const token = "<access-token>";
const chatClient = new ChatClient(endpoint, new AzureKeyCredential(token));
```

## 3. Create a Chat Thread

A chat thread is where messages are exchanged between participants.

```javascript
async function createChatThread() {
  const topic = "Team Discussion";
  const createChatThreadResult = await chatClient.createChatThread({ topic });
  const chatThreadClient = chatClient.getChatThreadClient(createChatThreadResult.chatThread.id);

  console.log(`Created chat thread with ID: ${chatThreadClient.threadId}`);
}

createChatThread();
```

## 4. Add/Remove Participants

You can add or remove participants from a chat thread.

```javascript
async function manageParticipants() {
  const newParticipant = {
    identifier: { communicationUserId: "<participant-id>" },
    displayName: "Jane Doe"
  };

  await chatThreadClient.addParticipants({ participants: [newParticipant] });
  console.log(`Added participant: ${newParticipant.displayName}`);

  // Remove a participant
  // await chatThreadClient.removeParticipant({ communicationUserId: "<participant-id>" });
}
```

## 5. Send Messages

Use the `ChatThreadClient` to send messages to the thread.

```javascript
async function sendChatMessage() {
  const sendMessageResult = await chatThreadClient.sendMessage({
    content: "Hello everyone! Welcome to the chat.",
    senderDisplayName: "John Doe"
  });

  console.log(`Message sent! ID: ${sendMessageResult.id}`);
}
```

## 6. Receive Messages (Real-time)

To receive messages in real-time, you use the `ChatClient`'s event listening capabilities. This is typically done in a browser environment.

```javascript
// Register for real-time notifications
await chatClient.startRealtimeNotifications();

// Subscribe to chat message received event
chatClient.on("chatMessageReceived", (event) => {
  console.log(`New message from ${event.senderDisplayName}: ${event.message}`);
});
```

## Full Code Example (Node.js)

Create a file named `chat_operations.js` with the following content:

```javascript
const { ChatClient } = require("@azure/communication-chat");
const { CommunicationIdentityClient } = require("@azure/communication-identity");

async function main() {
  try {
    const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
    const endpoint = process.env.COMMUNICATION_SERVICES_ENDPOINT;

    // Create identity client
    const identityClient = new CommunicationIdentityClient(connectionString);

    // Create users
    const user1 = await identityClient.createUser();
    const user2 = await identityClient.createUser();

    // Get token for user1
    const tokenResponse = await identityClient.getToken(user1, ["chat"]);

    // Initialize chat client for user1
    const chatClient = new ChatClient(endpoint, { token: tokenResponse.token });

    // Create thread
    const topic = "Tutorial Chat";
    const createResult = await chatClient.createChatThread({ topic });
    const threadId = createResult.chatThread.id;
    const threadClient = chatClient.getChatThreadClient(threadId);

    // Add user2 to thread
    const participant2 = { identifier: user2, displayName: "Alice" };
    await threadClient.addParticipants({ participants: [participant2] });

    // Send message
    await threadClient.sendMessage({ content: "Hi Alice!", senderDisplayName: "Bob" });

    // List messages
    const messages = threadClient.listMessages();
    for await (const m of messages) {
      if (m.type === 'text') {
        console.log(`[${m.createdOn}] ${m.senderDisplayName}: ${m.content.message}`);
      }
    }

  } catch (error) {
    console.error(`Exception: ${error.message}`);
  }
}

main();
```

## See Also
- [Chat Concepts](https://learn.microsoft.com/azure/communication-services/concepts/chat/concepts)
- [Chat SDK Troubleshooting](https://learn.microsoft.com/azure/communication-services/concepts/chat/troubleshooting)

## Sources
- [Azure Communication Chat client library for JavaScript](https://learn.microsoft.com/javascript/api/overview/azure/communication-chat-readme)
