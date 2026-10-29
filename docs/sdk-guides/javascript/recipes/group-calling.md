---
title: Group Calling
description: Joining and managing multi-participant group calls with the Azure Communication Services Calling SDK for JavaScript.
content_sources:
  - https://learn.microsoft.com/en-us/azure/communication-services/how-tos/calling-sdk/manage-calls
  - https://learn.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/about-call-types
---

# Group Calling

This recipe shows how to join and manage a multi-participant **group call** using the raw Azure Communication Services (ACS) Calling SDK for JavaScript. A group call is coordinated by a shared `groupId` (a GUID): every client that joins with the same `groupId` lands in the same call.

For a full-featured UI with minimal code, see the [Calling UI Composite](./calling-ui-composite.md) recipe, which wraps the same group-call locator.

## Prerequisites

- Complete the [Video Calling Tutorial](../tutorial/05-video-calling.md).
- Have an ACS user identity and access token with the `voip` scope for **each** participant.
- A bundler-enabled web app (Webpack or Vite) able to import `@azure/communication-calling`.

## 1. SDK Installation

```bash
npm install @azure/communication-calling @azure/communication-common
```

## 2. Create the CallAgent

Each participant needs their own `CallAgent`, created from their own access token.

```javascript
import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

const tokenCredential = new AzureCommunicationTokenCredential("<access-token>");
const callClient = new CallClient();
const callAgent = await callClient.createCallAgent(tokenCredential, {
  displayName: "Jane Doe"
});
```

## 3. Join the Group Call

Join with a `groupId` locator. Generate the GUID once and share it with every participant out of band (for example, from your application backend).

```javascript
// A shared GUID identifies the group call. All participants use the same value.
const groupLocator = { groupId: "29228d3e-040e-4656-a70e-890ab4e173e5" };

const call = callAgent.join(groupLocator, {
  audioOptions: { muted: false }
});

call.on("stateChanged", () => {
  console.log(`Call state: ${call.state}`); // Connecting -> Connected -> Disconnected
});
```

!!! tip "Generating a groupId"
    Use any valid GUID (for example, `crypto.randomUUID()` in the browser, or a server-generated value). Reuse the same `groupId` to let late joiners enter an in-progress call, and use a fresh `groupId` per logical meeting to avoid cross-talk.

## 4. Track Remote Participants

Group calls grow and shrink as people join and leave. Listen for `remoteParticipantsUpdated` to keep your roster current.

```javascript
call.on("remoteParticipantsUpdated", (e) => {
  e.added.forEach((participant) => {
    console.log("Joined:", participant.identifier);
    participant.on("stateChanged", () => {
      console.log("Participant state:", participant.state);
    });
  });

  e.removed.forEach((participant) => {
    console.log("Left:", participant.identifier);
  });
});

// Snapshot of everyone currently in the call.
console.log(`Current participant count: ${call.remoteParticipants.length}`);
```

## 5. Add or Remove Participants

Any connected participant can invite another ACS identity into the group call.

```javascript
// Invite another ACS user by identity.
call.addParticipant({ communicationUserId: "<invitee-acs-id>" });

// Remove a participant.
const target = call.remoteParticipants.find(
  (p) => p.identifier.communicationUserId === "<invitee-acs-id>"
);
if (target) {
  await call.removeParticipant(target.identifier);
}
```

## 6. Call Controls and Leaving

```javascript
// Mute / unmute the local participant.
await call.mute();
await call.unmute();

// Leave the group call (others remain connected).
await call.hangUp();
```

## 7. Best Practices

- Issue a **separate** access token per participant; do not share one token across users.
- Generate the `groupId` server-side and distribute it through an authenticated channel.
- Use a unique `groupId` per meeting to prevent unrelated users from joining the same call.
- Group calls support up to 350 participants per call — see [Platform Limits](../../../reference/platform-limits.md#voice-and-video-calling).
- Render at most the streams you can display; incoming remote video is capped by the SDK (see the same limits page).

## See Also

- [Calling UI Composite](./calling-ui-composite.md)
- [Video Calling Tutorial](../tutorial/05-video-calling.md)
- [Teams Interop](./teams-interop.md)
- [Platform Limits — Voice and Video Calling](../../../reference/platform-limits.md#voice-and-video-calling)

## Sources

- [Manage calls with the Calling SDK](https://learn.microsoft.com/en-us/azure/communication-services/how-tos/calling-sdk/manage-calls)
- [Call types in Azure Communication Services](https://learn.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/about-call-types)
</content>
