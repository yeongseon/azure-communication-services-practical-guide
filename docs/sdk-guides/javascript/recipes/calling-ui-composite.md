---
title: Calling UI Composite
description: Adding video calling UI with ACS UI Library composite components.
hide:
  - toc
content_sources:
  - https://learn.microsoft.com/azure/communication-services/concepts/ui-library/ui-library-overview
---

# Calling UI Composite

This recipe shows how to add a comprehensive video calling UI to your web application with minimal code using the Azure Communication Services (ACS) UI Library composite components.

## Prerequisites

- Complete the [Video Calling Tutorial](../tutorial/05-video-calling.md).
- Have an ACS user identity and access token with 'voip' scope.
- A React-based web application.

## 1. SDK Installation

```bash
npm install @azure/communication-react @azure/communication-common
```

## 2. Using CallComposite

The `CallComposite` provides a full calling experience, including a setup screen, call controls, and participant management.

```javascript
import { CallComposite, useAzureCommunicationCallAdapter } from "@azure/communication-react";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";
import React, { useMemo } from "react";

function CallingExperience() {
  const userId = { communicationUserId: "<user-id>" };
  const token = "<access-token>";
  const displayName = "Jane Doe";
  const groupId = "<group-id>"; // A unique UUID for the group call

  const credential = useMemo(() => new AzureCommunicationTokenCredential(token), [token]);

  const adapter = useAzureCommunicationCallAdapter({
    userId,
    displayName,
    credential,
    locator: { groupId }
  });

  if (!adapter) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <CallComposite adapter={adapter} />
    </div>
  );
}

export default CallingExperience;
```

## 3. Customizing the UI

You can customize the appearance and behavior of the `CallComposite` using various properties.

```javascript
<CallComposite 
  adapter={adapter} 
  options={{
    callControls: {
      displayType: 'compact', // Show compact controls
      microphoneButton: true,
      cameraButton: true,
      screenShareButton: false, // Disable screen sharing
      endCallButton: true
    }
  }}
/>
```

## 4. Handling Call Events

The adapter provides hooks and methods to handle call events.

```javascript
adapter.on("callEnded", (e) => {
    console.log("Call ended with reason: ", e.reason);
});
```

## 5. UI Library Localization

The UI Library supports multiple languages.

```javascript
import { LocalizationProvider, COMPONENT_LOCALE_EN_US } from "@azure/communication-react";

<LocalizationProvider locale={COMPONENT_LOCALE_EN_US}>
  <CallComposite adapter={adapter} />
</LocalizationProvider>
```

## 6. Best Practices

- Ensure your application has the necessary permissions to access the camera and microphone.
- Use a unique `groupId` for each group call to avoid interference.
- Monitor the adapter state to provide feedback to the user (e.g., loading, error).

## See Also
- [UI Library Composite Components](https://learn.microsoft.com/azure/communication-services/concepts/ui-library/ui-library-composites)
- [UI Library Architecture](https://learn.microsoft.com/azure/communication-services/concepts/ui-library/ui-library-architecture)

## Sources
- [Azure Communication Services UI Library](https://learn.microsoft.com/azure/communication-services/concepts/ui-library/ui-library-overview)
