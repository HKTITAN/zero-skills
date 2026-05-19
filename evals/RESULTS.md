# Pilot skill evaluations (2026-05-19)

- **Model:** claude-haiku-4-5-20251001
- **Trials:** 3 per configuration
- **Zero:** 0.1.3 (WSL Ubuntu)
- **Harness:** [HKTITAN/zero-agent-bench](https://github.com/HKTITAN/zero-agent-bench)

## zero-cli-pattern / eval-cli-echo

| Configuration | Pass rate | Mean attempts |
|---------------|-----------|---------------|
| With `zero-cli-pattern` | **3/3 (100%)** | 1.00 |
| Baseline (no skills) | 0/3 (0%) | — |

**Lift:** +100 pp pass rate (pilot sample). Baseline errors: PAR100, IMP001.

## zero-stdin-pipeline-pattern / eval-file-sum

| Configuration | Pass rate | Mean attempts |
|---------------|-----------|---------------|
| With `zero-stdin-pipeline-pattern` | 0/3 (0%) | — |
| Baseline (no skills) | 0/3 (0%) | — |

**Lift:** None on this pilot sample; both configurations failed with PAR100. File-I/O tasks remain hard for agents without stronger compiler/stdlib guidance.

## Pilot benchmark (context)

Full pilot (5 tasks, Haiku): Zero **1/5** vs Python **5/5**. See [zero-agent-bench/results/PILOT.md](https://github.com/HKTITAN/zero-agent-bench/blob/main/results/PILOT.md).
