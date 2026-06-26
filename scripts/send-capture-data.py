"""Send a handful of test emails so capture 6 (KQL) and capture 7 (Email
Insights) have real telemetry to screenshot. Intentionally minimal - matches
the email-test-report.md baseline (1 plain text, 1 HTML, 1 with attachment,
+ a small parallel burst).
"""

import base64
import os
import time
from concurrent.futures import ThreadPoolExecutor
from azure.communication.email import EmailClient

CONNECTION_STRING = os.environ["ACS_CONNECTION_STRING"]
SENDER_ADDRESS = os.environ["ACS_SENDER_ADDRESS"]
RECIPIENT = os.environ.get("ACS_RECIPIENT", "ychoe@microsoft.com")

client = EmailClient.from_connection_string(CONNECTION_STRING)


def send(message, label):
    try:
        poller = client.begin_send(message)
        result = poller.result()
        print(f"[{label}] sent: {result['id']}")
        return True
    except Exception as e:
        print(f"[{label}] FAILED: {e}")
        return False


def plain_message():
    return {
        "content": {
            "subject": "ACS capture: plain text",
            "plainText": "Capture data run - plain text body.",
        },
        "recipients": {"to": [{"address": RECIPIENT}]},
        "senderAddress": SENDER_ADDRESS,
    }


def html_message():
    return {
        "content": {
            "subject": "ACS capture: HTML",
            "html": "<html><body><h2>Hello</h2><p>Rich HTML capture run.</p></body></html>",
        },
        "recipients": {"to": [{"address": RECIPIENT}]},
        "senderAddress": SENDER_ADDRESS,
    }


def attachment_message():
    payload = base64.b64encode(b"capture-run attachment payload").decode("ascii")
    return {
        "content": {
            "subject": "ACS capture: attachment",
            "plainText": "See attached file.",
        },
        "attachments": [
            {
                "name": "capture.txt",
                "contentType": "text/plain",
                "contentInBase64": payload,
            }
        ],
        "recipients": {"to": [{"address": RECIPIENT}]},
        "senderAddress": SENDER_ADDRESS,
    }


def cc_message():
    return {
        "content": {
            "subject": "ACS capture: CC test",
            "plainText": "Capture - CC field exercise.",
        },
        "recipients": {
            "to": [{"address": RECIPIENT}],
            "cc": [{"address": RECIPIENT}],
        },
        "senderAddress": SENDER_ADDRESS,
    }


def main():
    print(f"Sender: {SENDER_ADDRESS}")
    print(f"Recipient: {RECIPIENT}")

    send(plain_message(), "01-plain")
    send(html_message(), "02-html")
    send(attachment_message(), "03-attach")
    send(cc_message(), "04-cc")

    # Small parallel burst so the Email Insights chart shows multiple bars
    # within a short window.
    with ThreadPoolExecutor(max_workers=3) as pool:
        futures = [pool.submit(send, plain_message(), f"burst-{i}") for i in range(3)]
        for f in futures:
            f.result()

    print("\nDone. Wait 5-10 min for diagnostic logs to land in Log Analytics.")


if __name__ == "__main__":
    main()
