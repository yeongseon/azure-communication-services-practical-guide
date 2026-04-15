---
title: Voice Calling
description: Automating voice calls with Azure Communication Services for Python.
content_sources:
  - https://learn.microsoft.com/azure/communication-services/quickstarts/voice-video-calling/get-started-with-call-automation?pivots=programming-language-python
---

# Voice Calling

This step demonstrates how to automate voice calls using the Azure Communication Services (ACS) Python SDK.

## 1. Prerequisites

- Complete the [Local Setup](./01-local-setup.md).
- Have a registered phone number in your ACS resource.

## 2. Call Automation Client Setup

Initialize the `CallAutomationClient` using the connection string.

```python
import os
from azure.communication.callautomation import CallAutomationClient

connection_string = os.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING")
call_automation_client = CallAutomationClient.from_connection_string(connection_string)
```

## 3. Create Outbound Call

To create an outbound call, specify the sender's phone number and the recipient's phone number.

```python
from azure.communication.callautomation import PhoneNumberIdentifier

caller = PhoneNumberIdentifier("<registered-phone-number>")
target = PhoneNumberIdentifier("<recipient-phone-number>")
callback_url = "https://<your-webhook-endpoint>/api/callback"

call_connection_properties = call_automation_client.create_call(
    target_participants=[target],
    source_caller_id_number=caller,
    callback_url=callback_url
)

print(f"Call connection ID: {call_connection_properties.call_connection_id}")
```

## 4. Play Audio Prompts

Once the call is established, you can play audio prompts or use text-to-speech.

```python
from azure.communication.callautomation import TextSource

# Assuming you have the call_connection_client from the callback
# call_connection_client = call_automation_client.get_call_connection(call_connection_id)

text_source = TextSource(text="Hello! This is a call from ACS Call Automation.", voice_name="en-US-JennyNeural")

call_connection_client.play_media(play_source=text_source)
```

## 5. Handle Call Events

Call events (like call answered, call disconnected) are delivered via webhooks to your `callback_url`.

```python
# Sample Flask/FastAPI endpoint to handle callbacks
from flask import Flask, request

app = Flask(__name__)

@app.route("/api/callback", methods=["POST"])
def handle_callback():
    event = request.json
    # Process event (e.g., CallConnected, CallDisconnected, PlayCompleted)
    print(f"Received call event: {event[0]['type']}")
    return "OK", 200

if __name__ == "__main__":
    app.run(port=5000)
```

## 6. Transfer Calls

You can also transfer calls to another phone number or ACS user.

```python
target_transfer = PhoneNumberIdentifier("<new-recipient-phone-number>")

transfer_result = call_connection_client.transfer_call_to_participant(
    target_participant=target_transfer
)

print(f"Transfer correlation ID: {transfer_result.operation_context}")
```

## Full Code Example

Create a file named `call_automation_demo.py` with the following content:

```python
import os
from azure.communication.callautomation import CallAutomationClient, PhoneNumberIdentifier, TextSource

def call_automation_demo():
    try:
        connection_string = os.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING")
        if not connection_string:
            print("Please set the COMMUNICATION_SERVICES_CONNECTION_STRING environment variable.")
            return

        call_automation_client = CallAutomationClient.from_connection_string(connection_string)

        caller = PhoneNumberIdentifier("<registered-phone-number>")
        target = PhoneNumberIdentifier("<recipient-phone-number>")
        callback_url = "https://<your-webhook-endpoint>/api/callback"

        # Create outbound call
        print("Starting outbound call...")
        call_connection_properties = call_automation_client.create_call(
            target_participants=[target],
            source_caller_id_number=caller,
            callback_url=callback_url
        )

        print(f"Call initiated. ID: {call_connection_properties.call_connection_id}")

    except Exception as ex:
        print(f"Exception: {ex}")

if __name__ == "__main__":
    call_automation_demo()
```

## See Also
- [Call Automation Concepts](https://learn.microsoft.com/azure/communication-services/concepts/call-automation/call-automation)
- [Call Automation Troubleshooting](https://learn.microsoft.com/azure/communication-services/concepts/call-automation/troubleshooting)

## Sources
- [Azure Communication Call Automation client library for Python](https://learn.microsoft.com/python/api/overview/azure/communication-callautomation-readme)
