"""Trigger hard bounce delivery events so KQL execution validation can
confirm the empirical value of `IsHardBounce` for True case (the workspace
had only observed "False" until now).

Sends 3 emails to guaranteed-invalid recipient addresses:
1. Unknown mailbox at gmail.com (deliverable domain, non-existent mailbox)
2. Unknown mailbox at gmail.com (different local part)
3. Non-existent domain (should also trigger bounce)

Env:
    ACS_CONNECTION_STRING - required
    ACS_SENDER_ADDRESS    - required
"""

import os
from azure.communication.email import EmailClient

CONNECTION_STRING = os.environ["ACS_CONNECTION_STRING"]
SENDER_ADDRESS = os.environ["ACS_SENDER_ADDRESS"]

INVALID_RECIPIENTS = [
    "definitely-nonexistent-mailbox-99999xyzabc@gmail.com",
    "no-such-user-abc-xyz-9999-9999@gmail.com",
    "hard-bounce-test-9999@nonexistent-domain-xyzabc99999.invalid",
]

client = EmailClient.from_connection_string(CONNECTION_STRING)


def main():
    print(f"Sender: {SENDER_ADDRESS}")
    for i, recipient in enumerate(INVALID_RECIPIENTS, 1):
        message = {
            "content": {
                "subject": f"Hard bounce KQL validation test {i}",
                "plainText": (
                    "This message is expected to hard bounce. Purpose: capture "
                    "empirical value of IsHardBounce (True case) in "
                    "law-acs-email-lab workspace for KQL documentation validation."
                ),
            },
            "recipients": {"to": [{"address": recipient}]},
            "senderAddress": SENDER_ADDRESS,
        }
        try:
            poller = client.begin_send(message)
            result = poller.result()
            print(
                f"[{i}] sent to {recipient}: id={result.get('id')} status={result.get('status')}"
            )
        except Exception as e:
            print(f"[{i}] FAILED for {recipient}: {e}")

    print("\nDone. Wait ~5-10 min for bounce events to land in Log Analytics.")
    print("Then query:")
    print("  ACSEmailStatusUpdateOperational")
    print("  | where TimeGenerated > ago(30m)")
    print('  | where DeliveryStatus == "Bounced"')
    print("  | distinct IsHardBounce, DeliveryStatus")


if __name__ == "__main__":
    main()
