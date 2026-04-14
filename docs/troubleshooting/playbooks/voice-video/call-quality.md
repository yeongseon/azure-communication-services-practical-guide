---
hide: [toc]
content_sources:
  - communication-services-sdk
  - calling-quality-guide
---

# Call Quality Playbook

**Symptom**: Poor audio/video quality during a call (jitter, lag, or distortion).

## Hypotheses

| Hypothesis | Likely Cause | Evidence Tag |
| --- | --- | --- |
| Bandwidth insufficient | Local network bandwidth is too low for the required bitrate | [Measured] |
| TURN blocked | UDP media traffic is blocked, forcing lower quality TCP fallback | [Observed] |
| Codec mismatch | The client or receiver is using an inefficient or unsupported codec | [Correlated] |
| Network jitter | High variability in packet delivery times causing audio artifacts | [Measured] |
| Device overload | High CPU or memory usage on the client's device | [Inferred] |

## Evidence Collection

### 1. User Facing Diagnostics (UFD)
Review the logs for `network-quality`, `bad-network`, or `media-stream-dropped` signals.

### 2. Azure Monitor Metrics
Check `CallMediaStreamQuality` metrics for latency and packet loss data.

### 3. Log Analytics
Query the `ACSCallDiagnosticsEvents` table.

## Validation

### [Measured] Monitor Bandwidth and Packet Loss
Check if the average packet loss exceeds 1-2% or if the latency is greater than 200ms. These are common thresholds for poor quality.

### [Observed] Validate TURN/STUN Accessibility
Verify that the client can establish a UDP connection for media. If blocked, the SDK will attempt a TCP relay, which is more prone to lag and jitter.

### [Correlated] Identify Codec Mismatch
Check the `CodecName` in `ACSCallDiagnosticsEvents`. If the browser or device does not support H.264, it may fallback to an older, lower-quality codec.

## Mitigation

1. **Enable UFD**: Use User Facing Diagnostics to inform the user when their network or device is causing poor quality.
2. **Optimize Media Path**: Ensure the client's firewall and proxy allow traffic to the required ACS UDP ports.
3. **Use Adaptive Bitrate**: The ACS SDK automatically adjusts bitrate based on network conditions. Ensure this feature is not disabled or restricted.
4. **Reduce Device Load**: Advise the user to close other high-resource applications or browsers during the call.
5. **Lower Video Resolution**: If bandwidth is limited, the app can programmatically lower the video resolution to prioritize audio quality.

## See Also
* [Call Drops](call-drops.md)
* [Connection Failures](oode-quality.md)

## Sources
* [ACS Calling SDK Troubleshooting Documentation](https://learn.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/user-facing-diagnostics)
* Real-time Media Optimization Guidelines
