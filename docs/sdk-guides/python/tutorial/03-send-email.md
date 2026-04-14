---
title: Send Email
description: Sending emails with Azure Communication Services for Python.
hide:
  - toc
content_sources:
  - https://learn.microsoft.com/azure/communication-services/quickstarts/email/send-email?tabs=windows&pivots=programming-language-python
---

# Send Email

This step demonstrates how to use the Azure Communication Services (ACS) Python SDK to send emails.

## 1. Prerequisites

- Complete the [Local Setup](./01-local-setup.md).
- Have a verified domain in your ACS resource.

## 2. EmailClient Setup

Initialize the `EmailClient` using the connection string.

```python
import os
from azure.communication.email import EmailClient

connection_string = os.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING")
email_client = EmailClient.from_connection_string(connection_string)
```

## 3. Send a Simple Email

Provide the sender's email address, recipient's email address, subject, and message content.

```python
message = {
    "content": {
        "subject": "Hello from ACS Email SDK!",
        "plainText": "This is a plain text email message sent with ACS Python SDK."
    },
    "recipients": {
        "to": [{"address": "<recipient-email-address>"}]
    },
    "senderAddress": "<verified-sender-email-address>"
}

poller = email_client.begin_send(message)
result = poller.result()
print(f"Message ID: {result['messageId']}")
```

## 4. Send Email with HTML Body

You can send HTML-formatted emails by providing the `html` content.

```python
message = {
    "content": {
        "subject": "HTML Email from ACS Email SDK!",
        "html": "<html><body><h1>Hello!</h1><p>This is an HTML email sent with ACS Python SDK.</p></body></html>"
    },
    "recipients": {
        "to": [{"address": "<recipient-email-address>"}]
    },
    "senderAddress": "<verified-sender-email-address>"
}

poller = email_client.begin_send(message)
result = poller.result()
print(f"Message ID: {result['messageId']}")
```

## 5. Send with Attachments

To send an email with attachments, provide the `attachments` list in the message dictionary.

```python
import base64

with open("sample.txt", "rb") as file:
    file_contents = file.read()
    content_bytes = base64.b64encode(file_contents).decode("utf-8")

message = {
    "content": {
        "subject": "Email with Attachment from ACS Email SDK!",
        "plainText": "This email contains an attachment."
    },
    "recipients": {
        "to": [{"address": "<recipient-email-address>"}]
    },
    "senderAddress": "<verified-sender-email-address>",
    "attachments": [
        {
            "name": "sample.txt",
            "contentType": "text/plain",
            "contentInBase64": content_bytes
        }
    ]
}

poller = email_client.begin_send(message)
result = poller.result()
print(f"Message ID: {result['messageId']}")
```

## 6. Poll for Delivery Status

The `begin_send` method returns a poller object that you can use to check the status of the email delivery.

```python
poller = email_client.begin_send(message)
while not poller.done():
    print(f"Polling status: {poller.status()}")
    poller.wait(2)

result = poller.result()
print(f"Status of email send: {result['status']}")
```

## Full Code Example

Create a file named `send_email.py` with the following content:

```python
import os
from azure.communication.email import EmailClient

def send_email():
    try:
        connection_string = os.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING")
        if not connection_string:
            print("Please set the COMMUNICATION_SERVICES_CONNECTION_STRING environment variable.")
            return

        email_client = EmailClient.from_connection_string(connection_string)

        message = {
            "content": {
                "subject": "Hello from ACS Email SDK tutorial!",
                "plainText": "This is a message sent from the ACS Python SDK tutorial."
            },
            "recipients": {
                "to": [{"address": "<recipient-email-address>"}]
            },
            "senderAddress": "<verified-sender-email-address>"
        }

        poller = email_client.begin_send(message)
        result = poller.result()
        print(f"Message ID: {result['messageId']}")

    except Exception as ex:
        print(f"Exception: {ex}")

if __name__ == "__main__":
    send_email()
```

## See Also
- [Email Troubleshooting](https://learn.microsoft.com/azure/communication-services/concepts/email/troubleshooting)
- [Email Delivery Reports](https://learn.microsoft.com/azure/communication-services/concepts/email/delivery-reports)

## Sources
- [Azure Communication Email client library for Python](https://learn.microsoft.com/python/api/overview/azure/communication-email-readme)
