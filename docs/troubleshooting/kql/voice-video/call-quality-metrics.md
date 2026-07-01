---
content_sources:
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/voice-and-video-logs
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscalldiagnostics
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscallsurvey
content_validation:
  status: verified
  last_reviewed: 2026-07-01
  reviewer: agent
  core_claims:
    - claim: "ACSCallDiagnostics exposes per-media-stream network metrics as RoundTripTimeAvg and RoundTripTimeMax (int, milliseconds), JitterAvg and JitterMax (int, milliseconds), and PacketLossRateAvg and PacketLossRateMax (real, fraction 0 to 1)"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscalldiagnostics
      verified: true
    - claim: "ACSCallDiagnostics rows are scoped by MediaType and StreamDirection and correlated with other calling tables via CorrelationId"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscalldiagnostics
      verified: true
    - claim: "ACSCallSurvey exposes participant-reported OverallRatingScore (int), and its CorrelationId column contains the participant ID used to correlate survey rows with other calling logs"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscallsurvey
      verified: true
    - claim: "ACSCallDiagnostics includes ParticipantId, enabling participant-scoped joins to survey rows"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscalldiagnostics
      verified: true
---

# Call Quality Metrics KQL

Aggregate per-media-stream network metrics from `ACSCallDiagnostics` and optionally correlate them with participant-reported ratings from `ACSCallSurvey`.

## Query Description

`ACSCallDiagnostics` emits one row per media stream per participant. The columns `RoundTripTimeAvg` and `RoundTripTimeMax` (integers in milliseconds), `JitterAvg` and `JitterMax` (integers in milliseconds), and `PacketLossRateAvg` and `PacketLossRateMax` (reals expressed as fractions between 0 and 1) describe stream-level network quality.

The first query below filters to streams that exceed engineer-defined degradation thresholds and aggregates per call (`CorrelationId`). The thresholds are illustrative — ACS does not publish preset "good/fair/poor" bands, so callers pick thresholds that match their own quality bar.

## KQL Query

```kusto
// Per-call aggregation of degraded media streams.
// Thresholds are engineer-defined; ACS does not publish preset quality bands.
let JitterThresholdMs = 30;
let RttThresholdMs = 200;
let PacketLossThreshold = 0.03; // 3%
ACSCallDiagnostics
| where TimeGenerated > ago(1h)
| where JitterAvg > JitterThresholdMs
    or RoundTripTimeAvg > RttThresholdMs
    or PacketLossRateAvg > PacketLossThreshold
| summarize
    DegradedStreamCount = count(),
    AverageJitterMs = avg(JitterAvg),
    AverageRoundTripMs = avg(RoundTripTimeAvg),
    AveragePacketLossRate = avg(PacketLossRateAvg)
    by CorrelationId, MediaType, StreamDirection
| order by AveragePacketLossRate desc
```

## Explanation

| Field | Description |
| --- | --- |
| `TimeGenerated > ago(1h)` | Restricts the scan to the last hour to keep queries cheap and focused on recent issues. |
| `JitterAvg > JitterThresholdMs` etc. | Engineer-defined degradation thresholds. Adjust these to match your quality bar; ACS does not emit a preset quality-band column. |
| `avg(JitterAvg)` etc. | Aggregates the per-stream network metrics that ACS already emits — no arithmetic against `TimeGenerated` is needed. |
| `by CorrelationId, MediaType, StreamDirection` | Groups by call, media type (for example `Audio` or `Video`), and direction (`Inbound` or `Outbound`). |

## Correlate with Post-Call Survey Ratings

Optional: correlate objective per-stream metrics from `ACSCallDiagnostics` with subjective ratings from `ACSCallSurvey`. Per the survey table reference, `ACSCallSurvey.CorrelationId` **contains the participant ID** used to correlate survey rows with other calling logs, so the join is against `ACSCallDiagnostics.ParticipantId` rather than diagnostics `CorrelationId`.

```kusto
let DiagnosticsAgg = ACSCallDiagnostics
| where TimeGenerated > ago(24h)
| summarize
    MaxPacketLossRate = max(PacketLossRateAvg),
    MaxJitterMs = max(JitterAvg),
    MaxRoundTripMs = max(RoundTripTimeAvg)
    by ParticipantId;
ACSCallSurvey
| where TimeGenerated > ago(24h)
| where isnotnull(OverallRatingScore)
| project SurveyParticipantId = CorrelationId, OverallRatingScore
| join kind=inner (DiagnosticsAgg) on $left.SurveyParticipantId == $right.ParticipantId
| project
    ParticipantId = SurveyParticipantId,
    OverallRatingScore,
    MaxPacketLossRate,
    MaxJitterMs,
    MaxRoundTripMs
| order by OverallRatingScore asc, MaxPacketLossRate desc
```

## Insights

* **Filter by media type and direction**: A degradation confined to `MediaType == "Video"` inbound streams points to different root causes than one that affects `Audio` outbound streams. Always slice by `MediaType` and `StreamDirection` before drawing conclusions.
* **Avg vs Max matters**: `RoundTripTimeAvg` and `RoundTripTimeMax` (and the same pattern for jitter and packet loss) capture different failure modes. A moderate average with a high max often indicates transient spikes rather than sustained degradation.
* **Objective vs subjective**: A poor `PacketLossRateAvg` with an acceptable `OverallRatingScore` from `ACSCallSurvey` still points to network health that could regress under different load; treat objective metrics as leading indicators.
* **No single quality score**: The documented columns for `ACSCallDiagnostics` do not include `MediaPathQuality` or an equivalent preset quality-band column. Quality banding is engineer-defined against the raw per-stream metrics.

## See Also
* [Voice/Video KQL Overview](index.md)
* [Call Quality Playbook](../../playbooks/voice-video/call-quality.md)

## Sources
* [Azure Communication Services voice and video call logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/voice-and-video-logs)
* [ACSCallDiagnostics table reference (Azure Monitor)](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscalldiagnostics)
* [ACSCallSurvey table reference (Azure Monitor)](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscallsurvey)
