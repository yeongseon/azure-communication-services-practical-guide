---
content_sources:
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/voice-and-video-logs
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscallsummary
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscalldiagnostics
  - type: mslearn
    url: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscallsurvey
content_validation:
  status: verified
  last_reviewed: 2026-07-01
  reviewer: agent
  core_claims:
    - claim: "ACS voice and video call summary logs land in ACSCallSummary, which contains one row per call participant representing a snapshot of the call state at the time of finalization"
      source: https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/voice-and-video-logs
      verified: true
    - claim: "ACSCallSummary includes columns such as CallDuration, ParticipantEndReason, and CorrelationId"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscallsummary
      verified: true
    - claim: "ACS call diagnostics logs land in ACSCallDiagnostics, one row per media stream per participant, with per-stream network metrics RoundTripTimeAvg, JitterAvg, and PacketLossRateAvg"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscalldiagnostics
      verified: true
    - claim: "ACS end-of-call survey logs land in ACSCallSurvey with participant-reported OverallRatingScore, AudioRatingScore, VideoRatingScore, and ScreenshareRatingScore"
      source: https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscallsurvey
      verified: true
---

# Voice/Video KQL Overview

Analyze call quality, media performance, and per-participant call outcomes using the calling log tables that ACS actually emits.

## Log Analytics Tables

ACS calling emits multiple log types. The three tables covered here are the ones most commonly queried for post-call quality and outcome analysis. `CorrelationId` joins call-scoped rows across `ACSCallSummary` and `ACSCallDiagnostics`; the survey table uses a participant-scoped correlator described in the key columns section below.

| Table | Grain | Purpose |
| --- | --- | --- |
| `ACSCallSummary` | One row per call participant | Call-level and participant-level metadata: `CallDuration`, `CallStartTime`, `ParticipantEndReason`, `ParticipantType`, `EndpointType`, PSTN participant info. |
| `ACSCallDiagnostics` | One row per media stream per participant | Per-stream network quality metrics: `RoundTripTimeAvg`/`Max`, `JitterAvg`/`Max`, `PacketLossRateAvg`/`Max`, plus stream metadata like `MediaType`, `StreamDirection`, `CodecName`. |
| `ACSCallSurvey` | One row per submitted survey | Participant-reported ratings: `OverallRatingScore`, `AudioRatingScore`, `VideoRatingScore`, `ScreenshareRatingScore`, plus reported issue categories. |

Key columns used across the queries below:

* `CorrelationId` — joins call-scoped rows across `ACSCallSummary` and `ACSCallDiagnostics`. For `ACSCallSurvey`, the table reference documents `CorrelationId` as the participant ID used to correlate survey rows with other calling logs, so survey joins go through the participant identifier rather than the call correlator.
* `ParticipantEndReason` — participant's call end reason on `ACSCallSummary`. There is no `CallEndReason` column; the reason is scoped per participant.
* `RoundTripTimeAvg`, `JitterAvg` — integers in milliseconds on `ACSCallDiagnostics`.
* `PacketLossRateAvg` — a real between 0 and 1 on `ACSCallDiagnostics`.
* `MediaType`, `StreamDirection` — filter dimensions on `ACSCallDiagnostics` (for example `Audio` vs `Video`, `Inbound` vs `Outbound`).
* `OverallRatingScore`, `AudioRatingScore`, `VideoRatingScore` — integers on `ACSCallSurvey`; each has a companion `*RatingScoreLowerBound`, `*RatingScoreUpperBound`, and `*RatingScoreThreshold` for interpretation.

!!! note "No preset quality score column"
    The documented columns for `ACSCallDiagnostics` and `ACSCallSummary` do not include a preset per-call or per-stream quality-score column. Objective network quality is expressed as raw metrics (`RoundTripTimeAvg`, `JitterAvg`, `PacketLossRateAvg`) that engineers bucket against their own thresholds. Subjective quality comes from `ACSCallSurvey` ratings, which are user-reported and optional.

## Key Scenarios

| Scenario | KQL Query | Description |
| --- | --- | --- |
| **Per-Stream Network Quality** | [Call Quality Metrics](call-quality-metrics.md) | Aggregate `RoundTripTimeAvg`, `JitterAvg`, and `PacketLossRateAvg` per call across degraded streams. |
| **Participant End Reasons** | [Participant End Reasons](#participant-end-reasons) | Track why participants left calls over time, using `ParticipantEndReason` on `ACSCallSummary`. |
| **Post-Call Subjective Quality** | [Survey Ratings](#survey-ratings) | Aggregate participant-reported `OverallRatingScore` from `ACSCallSurvey`. |

## Query Examples

### Participant End Reasons
Track how participants left calls (for example clean hang-up vs error). `ACSCallSummary` emits one row per participant with `ParticipantEndReason` populated.

```kusto
ACSCallSummary
| where TimeGenerated > ago(24h)
| summarize ParticipantCount = count() by ParticipantEndReason, bin(TimeGenerated, 1h)
| render barchart
```

### Survey Ratings
Aggregate participant-submitted overall call quality ratings. `OverallRatingScore` is an integer; use the companion `OverallRatingScoreLowerBound`, `OverallRatingScoreUpperBound`, and `OverallRatingScoreThreshold` columns to interpret the scale for each rating.

```kusto
ACSCallSurvey
| where TimeGenerated > ago(24h)
| where isnotnull(OverallRatingScore)
| summarize
    AverageOverallScore = avg(OverallRatingScore),
    SurveyCount = count()
    by bin(TimeGenerated, 1h)
| render timechart
```

## See Also
* [Call Quality Metrics KQL](call-quality-metrics.md)
* [Call Quality Playbook](../../playbooks/voice-video/call-quality.md)

## Sources
* [Azure Communication Services voice and video call logs](https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/logs/voice-and-video-logs)
* [ACSCallSummary table reference (Azure Monitor)](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscallsummary)
* [ACSCallDiagnostics table reference (Azure Monitor)](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscalldiagnostics)
* [ACSCallSurvey table reference (Azure Monitor)](https://learn.microsoft.com/en-us/azure/azure-monitor/reference/tables/acscallsurvey)
