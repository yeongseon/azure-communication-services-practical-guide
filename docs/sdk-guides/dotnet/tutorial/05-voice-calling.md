---
title: 'Step 5: Voice Calling'
description: Build telephony applications with Call Automation and the .NET SDK.
content_sources:
  sources:
  - id: dotnet-voice-calling
    type: documentation
    source: self
    justification: Explains Call Automation features in .NET.
    based_on: https://learn.microsoft.com/azure/communication-services/quickstarts/call-automation/quickstart-make-an-outbound-call
  diagrams:
  - id: 05-voice-calling-page-flow
    type: flowchart
    source: self-generated
    justification: Synthesized from the page structure and Microsoft Learn sources
      listed in this document.
    based_on:
    - https://learn.microsoft.com/azure/communication-services/quickstarts/call-automation/quickstart-make-an-outbound-call
validation:
  az_cli:
    last_tested: null
    result: not_tested
  bicep:
    last_tested: null
    result: not_tested
content_validation:
  status: verified
  last_reviewed: '2026-05-23'
  reviewer: agent
  core_claims:
  - claim: This page uses Microsoft Learn as the primary source basis for its Azure-specific
      guidance.
    source: https://learn.microsoft.com/azure/communication-services/quickstarts/call-automation/quickstart-make-an-outbound-call
    verified: true
---
# Step 5: Voice Calling

Use the `CallAutomationClient` to make outbound calls and handle telephony events.

## 1. Add Call Automation NuGet Package

```bash
dotnet add package Azure.Communication.CallAutomation
```

## 2. Initialize CallAutomationClient

```csharp
using Azure.Communication.CallAutomation;

string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
CallAutomationClient callClient = new CallAutomationClient(connectionString);
```

## 3. Make an Outbound Call

```csharp
using Azure.Communication;

public async Task MakeCall()
{
    var target = new PhoneNumberIdentifier("+1234567890");
    var caller = new PhoneNumberIdentifier("+10987654321");
    var callbackUri = new Uri("https://your-app.com/callbacks/call");

    CallInvite invite = new CallInvite(target, caller);
    CreateCallResult result = await callClient.CreateCallAsync(invite, callbackUri);
    
    Console.WriteLine($"Call Connection ID: {result.CallConnectionProperties.CallConnectionId}");
}
```

## 4. Play Audio Prompts

```csharp
public async Task PlayAudio(string callConnectionId)
{
    CallConnection callConnection = callClient.GetCallConnection(callConnectionId);
    
    var audioSource = new FileSource(new Uri("https://storage.com/welcome.wav"));
    await callConnection.GetCallMedia().PlayToAllAsync(audioSource);
}
```

## 5. DTMF Recognition

```csharp
public async Task StartRecognition(string callConnectionId)
{
    CallConnection callConnection = callClient.GetCallConnection(callConnectionId);
    
    var recognizeOptions = new CallMediaRecognizeDtmfOptions(new PhoneNumberIdentifier("+1234567890"), maxDigits: 1)
    {
        InterDigitTimeout = TimeSpan.FromSeconds(5),
        InterruptPrompt = true
    };

    await callConnection.GetCallMedia().StartRecognizingAsync(recognizeOptions);
}
```

## Full Code Example

```csharp
using System;
using System.Threading.Tasks;
using Azure.Communication.CallAutomation;
using Azure.Communication;

class Program
{
    static async Task Main(string[] args)
    {
        // Implementation for outbound call and event handling
    }
}
```

## Next Step

Implement [Logging & Monitoring](./06-logging-monitoring.md) for your application.

## Page Flow

<!-- diagram-id: 05-voice-calling-page-flow -->
```mermaid
flowchart TD
    A["Step 5: Voice Calling"]
    B["1. Add Call Automation NuGet Package"]
    C["2. Initialize CallAutomationClient"]
    D["3. Make an Outbound Call"]
    E["4. Play Audio Prompts"]
    A --> B
    B --> C
    C --> D
    D --> E
```

## Review Matrix

| Review area | Page-specific check |
|---|---|
| Scope | Confirm the guidance applies to Step 5: Voice Calling. |
| Source basis | Validate the recommendation against the Microsoft Learn sources in this page. |
| Evidence | Capture command output, portal state, metrics, logs, or screenshots before treating the result as proven. |

## See Also

- [Guide home](../../../index.md)
- [Section index](index.md)
- [Start here](../../../start-here/overview.md)

## Sources
- [Quickstart: Make an outbound call using Call Automation](https://learn.microsoft.com/azure/communication-services/quickstarts/call-automation/quickstart-make-an-outbound-call)
