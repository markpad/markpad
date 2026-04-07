# System Diagram

A compact architecture note for a telemetry ingestion service.

## Components

- `edge-gateway`
- `queue-router`
- `metrics-aggregator`
- `alert-dispatch`

## Throughput Targets

| Channel | Current | Target |
| --- | --- | --- |
| Events/sec | 14,200 | 20,000 |
| P95 latency | 86ms | 60ms |
| Error rate | 0.42% | < 0.20% |

> Keep links short and module boundaries explicit in every revision.

### Notes

1. Normalize payload schema before persistence.
2. Keep queue fan-out deterministic.
3. Record retry reason per worker.
