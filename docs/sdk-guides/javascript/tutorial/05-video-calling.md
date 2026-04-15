---
title: Video Calling
description: Building browser-based video calling with Azure Communication Services for JavaScript.
content_sources:
  - https://learn.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/getting-started-with-calling?pivots=programming-language-javascript
---

# Video Calling

This step demonstrates how to build a browser-based video calling experience using the Azure Communication Services (ACS) JavaScript SDK.

## 1. Prerequisites

- Complete the [Local Setup](./01-local-setup.md).
- Have an ACS user identity and access token with 'voip' scope.

## 2. CallClient Setup

Initialize the `CallClient` and create a `CallAgent`.

```javascript
import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

const tokenCredential = new AzureCommunicationTokenCredential("<access-token>");
const callClient = new CallClient();
const callAgent = await callClient.createCallAgent(tokenCredential);
```

## 3. Start/Join Video Call

To start or join a video call, use the `callAgent.startCall` or `callAgent.join` methods.

```javascript
const userToCall = { communicationUserId: "<recipient-id>" };
const videoDeviceInfo = await callClient.getDeviceManager().getCameras();
const localVideoStream = new LocalVideoStream(videoDeviceInfo[0]);

const call = callAgent.startCall([userToCall], {
    videoOptions: {
        localVideoStreams: [localVideoStream]
    }
});
```

## 4. Manage Local/Remote Video Streams

Render the local video stream in your UI.

```javascript
const renderer = new VideoStreamRenderer(localVideoStream);
const view = await renderer.createView();
document.getElementById("localVideoContainer").appendChild(view.target);
```

To render remote video streams, listen for the `remoteParticipantsUpdated` and `videoStreamsUpdated` events.

```javascript
call.on("remoteParticipantsUpdated", (e) => {
    e.added.forEach(participant => {
        participant.on("videoStreamsUpdated", (ev) => {
            ev.added.forEach(stream => {
                if (stream.isAvailable) {
                    renderRemoteStream(stream);
                }
            });
        });
    });
});

async function renderRemoteStream(stream) {
    const renderer = new VideoStreamRenderer(stream);
    const view = await renderer.createView();
    document.getElementById("remoteVideoContainer").appendChild(view.target);
}
```

## 5. Mute/Unmute and Screen Sharing

Manage call controls such as muting audio or sharing your screen.

```javascript
// Mute/Unmute
await call.mute();
await call.unmute();

// Start/Stop Screen Sharing
await call.startScreenSharing();
await call.stopScreenSharing();
```

## 6. UI Calling Composite Component

For a more comprehensive UI with minimal code, use the ACS UI Library.

```bash
npm install @azure/communication-react
```

```javascript
import { CallComposite } from "@azure/communication-react";

function CallingExperience() {
  const adapter = useAzureCommunicationCallAdapter({
    userId: { communicationUserId: "<user-id>" },
    displayName: "User Name",
    credential: tokenCredential,
    locator: { groupId: "<group-id>" } // For group calls
  });

  return <CallComposite adapter={adapter} />;
}
```

## Full Code Example (Browser)

Create a file named `calling.js` with the following content (you'll need to use a bundler like Webpack or Vite):

```javascript
import { CallClient, LocalVideoStream, VideoStreamRenderer } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

async function main() {
  try {
    const tokenCredential = new AzureCommunicationTokenCredential("<access-token>");
    const callClient = new CallClient();
    const callAgent = await callClient.createCallAgent(tokenCredential);

    const callButton = document.getElementById("callButton");
    callButton.onclick = async () => {
      const userToCall = { communicationUserId: document.getElementById("userIdInput").value };
      const call = callAgent.startCall([userToCall]);
      
      call.on("stateChanged", () => {
        console.log(`Call state changed: ${call.state}`);
      });
    };

  } catch (error) {
    console.error(`Exception: ${error.message}`);
  }
}

main();
```

## See Also
- [Voice & Video Calling Concepts](https://learn.microsoft.com/azure/communication-services/concepts/voice-video-calling/about-call-client-library)
- [UI Library Overview](https://learn.microsoft.com/azure/communication-services/concepts/ui-library/ui-library-overview)

## Sources
- [Azure Communication Calling client library for JavaScript](https://learn.microsoft.com/javascript/api/overview/azure/communication-calling-readme)
