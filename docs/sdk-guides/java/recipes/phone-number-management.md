---
title: Phone Number Management with Java
description: Programmatically search and purchase phone numbers using the Java SDK.
content_validation:
  status: pending_review
  last_reviewed: null
  reviewer: agent
  core_claims: []
---

# Phone Number Management with Java

Manage your ACS phone numbers directly from your Java application using the `PhoneNumbersClient`.

## 1. Add Phone Numbers Dependency

Include the following in your `pom.xml`:

```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-communication-phonenumbers</artifactId>
    <version>1.1.0</version>
</dependency>
```

## 2. Initialize PhoneNumbersClient

```java
import com.azure.communication.phonenumbers.PhoneNumbersClient;
import com.azure.communication.phonenumbers.PhoneNumbersClientBuilder;

String connectionString = System.getenv("COMMUNICATION_SERVICES_CONNECTION_STRING");
PhoneNumbersClient client = new PhoneNumbersClientBuilder()
    .connectionString(connectionString)
    .buildClient();
```

## 3. Search and Purchase a Number

This is a multi-step process: search, then purchase using the search ID.

```java
import com.azure.communication.phonenumbers.models.*;
import com.azure.core.util.polling.SyncPoller;

public void purchaseNumber() {
    // 1. Search for available numbers
    PhoneNumberSearchOptions options = new PhoneNumberSearchOptions()
        .setQuantity(1);

    SyncPoller<PhoneNumberSearchResult, PhoneNumberSearchResult> poller = 
        client.beginSearchAvailablePhoneNumbers("US", PhoneNumberType.TOLL_FREE, 
            PhoneNumberAssignmentType.APPLICATION, PhoneNumberCapabilityType.OUTBOUND, options);

    PhoneNumberSearchResult searchResult = poller.getFinalResult();
    String searchId = searchResult.getSearchId();

    // 2. Purchase the number
    SyncPoller<Void, Void> purchasePoller = client.beginPurchasePhoneNumbers(searchId);
    purchasePoller.waitForCompletion();

    System.out.println("Purchased number: " + searchResult.getPhoneNumbers().get(0));
}
```

## 4. List Purchased Numbers

```java
public void listNumbers() {
    client.listPurchasedPhoneNumbers().forEach(number -> {
        System.out.println("Number: " + number.getPhoneNumber());
        System.out.println("Capabilities: " + number.getCapabilities());
    });
}
```

## Sources
- [Quickstart: Search and purchase phone numbers](https://learn.microsoft.com/azure/communication-services/quickstarts/telephony/get-phone-number)
