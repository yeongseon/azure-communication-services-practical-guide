---
title: Email with Attachments
description: Sending emails with multiple file attachments using ACS and JavaScript.
content_sources:
  - https://learn.microsoft.com/azure/communication-services/quickstarts/email/send-email?pivots=programming-language-javascript
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---

# Email with Attachments

This recipe shows how to send emails with file attachments using Azure Communication Services (ACS) and JavaScript.

## Prerequisites

- Complete the [Send Email Tutorial](../tutorial/03-send-email.md).
- Have a verified domain and sender email address.

## 1. SDK Installation

```bash
npm install @azure/communication-email
```

## 2. Prepare Attachments

Attachments must be base64-encoded and include a name and content type.

```javascript
const fs = require("fs");
const path = require("path");

function prepareAttachment(filePath, contentType) {
    const fileContents = fs.readFileSync(filePath);
    const contentBytes = fileContents.toString("base64");
        
    return {
        name: path.basename(filePath),
        contentType: contentType,
        contentInBase64: contentBytes
    };
}
```

## 3. Send Email with Multiple Attachments

Include the prepared attachments in the `attachments` list of the message.

```javascript
const { EmailClient } = require("@azure/communication-email");
const { DefaultAzureCredential } = require("@azure/identity");

// Initialize client
const endpoint = process.env.COMMUNICATION_SERVICES_ENDPOINT;
const emailClient = new EmailClient(endpoint, new DefaultAzureCredential());

async function sendEmailWithAttachments() {
  // Prepare attachments
  const attachment1 = prepareAttachment("document.pdf", "application/pdf");
  const attachment2 = prepareAttachment("image.png", "image/png");

  // Create email message
  const message = {
    senderAddress: "<verified-sender-email-address>",
    content: {
        subject: "ACS Email with Multiple Attachments",
        plainText: "See the attached files for your reference."
    },
    recipients: {
        to: [{ address: "<recipient-email-address>" }]
    },
    attachments: [attachment1, attachment2]
  };

  // Send email
  const poller = await emailClient.beginSend(message);
  const result = await poller.pollUntilDone();
  console.log(`Message ID: ${result.messageId}`);
}

sendEmailWithAttachments();
```

## 4. Attachment Size Limits

ACS has limits on the total size of an email and individual attachments.

- **Total Email Size**: 25 MB (including attachments).
- **Max Attachments**: No strict limit, but bounded by total email size.

!!! warning "Important"
    Base64 encoding increases the size of attachments by approximately 33%. For large files, consider providing a link to a secure storage location (e.g., Azure Blob Storage) instead.

## 5. Multiple Attachment Types

Common content types include:
- `application/pdf`
- `image/png`
- `image/jpeg`
- `text/plain`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (Word doc)

## 6. Best Practices

- Always validate file size before encoding to avoid exceeding limits.
- Use meaningful attachment names.
- Consider compression for large documents.

## See Also
- [ACS Email Concepts](https://learn.microsoft.com/azure/communication-services/concepts/email/email-attachment)
- [Email Troubleshooting](https://learn.microsoft.com/azure/communication-services/concepts/email/troubleshooting)

## Sources
- [Azure Communication Email client library for JavaScript](https://learn.microsoft.com/javascript/api/overview/azure/communication-email-readme)
