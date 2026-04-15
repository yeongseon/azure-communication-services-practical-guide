---
title: Chat with File Sharing
description: Implementing file sharing in Azure Communication Services chat with Python.
content_sources:
  - https://learn.microsoft.com/azure/communication-services/quickstarts/chat/get-started?pivots=programming-language-python
---

# Chat with File Sharing

This recipe shows how to share files in Azure Communication Services (ACS) chat threads using Python.

## Prerequisites

- Complete the [Real-time Chat Tutorial](../tutorial/04-chat.md).
- Have an ACS chat thread ID and participant.

## 1. SDK Installation

```bash
pip install azure-communication-chat
```

## 2. File Metadata Handling

While the ACS chat service doesn't store files, you can share file metadata (like name, type, and URL) in a chat message. You'll typically store the file in a separate service (like Azure Blob Storage) and share the link.

```python
import os
from azure.communication.chat import ChatClient
from azure.identity import DefaultAzureCredential

# Initialize client
endpoint = os.getenv("COMMUNICATION_SERVICES_ENDPOINT")
chat_client = ChatClient(endpoint, DefaultAzureCredential())
chat_thread_client = chat_client.get_chat_thread_client("<your-thread-id>")

# Share file metadata in a chat message
file_metadata = {
    "fileName": "sample.pdf",
    "fileType": "application/pdf",
    "fileUrl": "https://<your-blob-storage-account>.blob.core.windows.net/chat-files/sample.pdf",
    "fileSize": "1.2 MB"
}

message_content = f"I've shared a file: {file_metadata['fileName']}. You can download it here: {file_metadata['fileUrl']}"

# Send message with file link
send_message_result = chat_thread_client.send_message(
    content=message_content,
    sender_display_name="File Sharer"
)

print(f"Message with file link sent! ID: {send_message_result.id}")
```

## 3. Custom Message Types

For more structured file sharing, you can use the `metadata` property of a chat message.

```python
# Send a message with file metadata in the message metadata
send_message_result = chat_thread_client.send_message(
    content="Check out this document.",
    sender_display_name="File Sharer",
    metadata=file_metadata
)

print(f"Message with structured metadata sent! ID: {send_message_result.id}")
```

## 4. Download Patterns

When a recipient receives a message with file metadata, they can use the `fileUrl` to download the file.

```python
# Retrieve messages from the thread
messages = chat_thread_client.list_messages()

for message in messages:
    if message.metadata and "fileUrl" in message.metadata:
        file_name = message.metadata["fileName"]
        file_url = message.metadata["fileUrl"]
        print(f"Received file: {file_name}. Download URL: {file_url}")
```

## 5. Security Considerations

- Use Shared Access Signatures (SAS) with Azure Blob Storage to provide temporary access to files.
- Validate file types and sizes before uploading.
- Implement proper authorization to ensure only chat thread participants can access shared files.

## 6. Best Practices

- Use descriptive file names.
- Provide file previews if possible.
- Group multiple files in a single message if relevant.

## See Also
- [Azure Blob Storage Documentation](https://learn.microsoft.com/azure/storage/blobs/storage-blobs-introduction)
- [SAS Tokens](https://learn.microsoft.com/azure/storage/common/storage-sas-overview)

## Sources
- [Azure Communication Chat client library for Python](https://learn.microsoft.com/python/api/overview/azure/communication-chat-readme)
