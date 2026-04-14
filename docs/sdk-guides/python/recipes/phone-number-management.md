---
title: Phone Number Management
description: Managing ACS phone numbers with Python.
hide:
  - toc
content_sources:
  - https://learn.microsoft.com/azure/communication-services/quickstarts/telephony/get-phone-number?pivots=programming-language-python
---

# Phone Number Management

This recipe shows how to search, purchase, and release Azure Communication Services (ACS) phone numbers using the Python SDK.

## Prerequisites

- [ACS Resource](https://learn.microsoft.com/azure/communication-services/quickstarts/create-communication-resource).
- [Managed Identity](https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) or connection string.

## SDK Installation

```bash
pip install azure-communication-phonenumbers
```

## Search Available Phone Numbers

You can search for available phone numbers by country, area code, and type.

```python
import os
from azure.communication.phonenumbers import PhoneNumbersClient
from azure.identity import DefaultAzureCredential

# Initialize client
endpoint = os.getenv("COMMUNICATION_SERVICES_ENDPOINT")
client = PhoneNumbersClient(endpoint, DefaultAzureCredential())

# Search for available phone numbers in the US with SMS capabilities
search_poller = client.begin_search_available_phone_numbers(
    area_code="425",
    country_code="US",
    phone_number_type="geographic",
    assignment_type="person",
    capabilities={"sms": "inbound+outbound", "calling": "none"},
    quantity=1
)

search_result = search_poller.result()
print(f"Found phone number: {search_result.phone_numbers[0]}")
print(f"Search ID: {search_result.search_id}")
```

## Purchase Phone Numbers

To purchase a phone number, use the `search_id` from the search result.

```python
# Purchase the phone number (uncomment carefully)
# purchase_poller = client.begin_purchase_phone_numbers(search_result.search_id)
# purchase_poller.result()
# print("Phone number purchased successfully!")
```

## Configure Capabilities

You can update the capabilities of an existing phone number.

```python
# Update capabilities for a specific phone number
# update_poller = client.begin_update_phone_number_capabilities(
#     "<your-phone-number>",
#     sms="inbound+outbound",
#     calling="none"
# )
# update_poller.result()
# print("Phone number capabilities updated!")
```

## Release Phone Numbers

If you no longer need a phone number, you can release it.

```python
# Release a phone number (uncomment carefully)
# release_poller = client.begin_release_phone_number("<your-phone-number>")
# release_poller.result()
# print("Phone number released successfully!")
```

## List Purchased Phone Numbers

You can list all the phone numbers currently purchased in your ACS resource.

```python
# List all purchased phone numbers
purchased_numbers = client.list_purchased_phone_numbers()
for number in purchased_numbers:
    print(f"Phone number: {number.phone_number}, Type: {number.phone_number_type}")
```

## See Also
- [ACS Phone Number Concepts](https://learn.microsoft.com/azure/communication-services/concepts/telephony/phone-number-types)
- [ACS Telephony Pricing](https://azure.microsoft.com/pricing/details/communication-services/)

## Sources
- [Azure Communication Phone Numbers client library for Python](https://learn.microsoft.com/python/api/overview/azure/communication-phonenumbers-readme)
