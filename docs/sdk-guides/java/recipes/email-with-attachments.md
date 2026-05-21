---
title: Email with Attachments (Java)
description: Send Azure Communication Services email messages with one or more file attachments using the Java SDK.
content_sources:
  - https://learn.microsoft.com/azure/communication-services/quickstarts/email/send-email-advanced/send-email-with-attachments
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---

# Email with Attachments (Java)

Use the ACS Email SDK when you need to send receipts, reports, or screenshots.

!!! note "Attachment limits"
    ACS email supports up to **10 attachments per message** and **10 MB per attachment**.

## Setup

Create an `EmailClient` from the connection string stored in Key Vault or App Configuration.

| Item | Value |
| --- | --- |
| SDK | `com.azure:azure-communication-email` |
| Auth | Connection string |
| Attachment data | `BinaryData` from file bytes |

## Build the message

Create an `EmailMessage`, then add `EmailAttachment` instances for each file.

```java
import com.azure.communication.email.EmailClient;
import com.azure.communication.email.EmailClientBuilder;
import com.azure.communication.email.models.EmailAttachment;
import com.azure.communication.email.models.EmailMessage;
import com.azure.communication.email.models.EmailRecipients;
import com.azure.communication.email.models.EmailAddress;
import com.azure.communication.email.models.EmailContent;
import com.azure.core.util.BinaryData;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

public class EmailWithAttachmentsExample {
    public static void main(String[] args) throws Exception {
        String connectionString = System.getenv("ACS_EMAIL_CONNECTION_STRING");
        String sender = "DoNotReply@contoso.com";
        String recipient = "user@contoso.com";

        EmailClient client = new EmailClientBuilder()
            .connectionString(connectionString)
            .buildClient();

        byte[] invoiceBytes = Files.readAllBytes(Path.of("invoice.pdf"));
        byte[] logoBytes = Files.readAllBytes(Path.of("logo.png"));

        // Base64 is useful when you need to inspect or forward the payload yourself.
        String invoiceBase64 = Base64.getEncoder().encodeToString(invoiceBytes);
        System.out.println("Invoice bytes (base64 preview): " + invoiceBase64.substring(0, 24) + "...");

        EmailAttachment invoice = new EmailAttachment(
            "invoice.pdf",
            "application/pdf",
            BinaryData.fromBytes(invoiceBytes));

        EmailAttachment logo = new EmailAttachment(
            "logo.png",
            "image/png",
            BinaryData.fromBytes(logoBytes));

        EmailAttachment csv = new EmailAttachment(
            "summary.csv",
            "text/csv",
            BinaryData.fromBytes(Files.readAllBytes(Path.of("summary.csv"))));

        EmailMessage message = new EmailMessage()
            .setSenderAddress(sender)
            .setRecipients(new EmailRecipients().setTo(List.of(new EmailAddress(recipient))))
            .setContent(new EmailContent()
                .setSubject("Monthly package")
                .setPlainText("Attached are the invoice, logo, and summary.")
                .setHtml("<p>Attached are the invoice, logo, and summary.</p>"));

        message.getAttachments().add(invoice);
        message.getAttachments().add(logo);
        message.getAttachments().add(csv);

        client.send(message);
        System.out.println("Message queued.");
    }
}
```

## Multiple attachment types

- `application/pdf` for invoices and statements
- `image/png` or `image/jpeg` for screenshots
- `text/csv` for exports and reports
- `application/zip` for bundles

## Practical notes

!!! tip "Keep attachments small"
    Large files slow down delivery and increase the chance of transient failures. Prefer links for oversized artifacts.

If you need to attach generated content, write it to disk or bytes first, then wrap it with `BinaryData.fromBytes(...)`.

## See Also

- [Java email quickstart](../index.md)
- [Managed Identity for Java](./managed-identity.md)

## Sources

- https://learn.microsoft.com/azure/communication-services/quickstarts/email/send-email-advanced/send-email-with-attachments
- https://learn.microsoft.com/azure/communication-services/concepts/email/email-attachment
