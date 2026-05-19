# Pattern skill evaluations

Each pattern skill must demonstrate measurable lift on a targeted task using [`zero-agent-bench`](https://github.com/HKTITAN/zero-agent-bench).

## Merge bar

From [CONTRIBUTING.md](../CONTRIBUTING.md), a skill ships if **at least one** holds on Sonnet 4.6 or Haiku 4.5:

- Pass rate improves by **≥ 20 percentage points**
- Mean attempts-to-green decreases by **≥ 0.5** without pass-rate regression
- Mean output tokens per success decreases by **≥ 20%** without pass-rate regression

## How to run

From this repo (with `zero-agent-bench` checked out as a sibling directory):

```bash
export ANTHROPIC_API_KEY=sk-ant-...
./evals/run-eval.sh zero-cli-pattern eval-cli-echo
```

The script runs:

1. **With** `--skill-file skills/<skill>.md --skill-only`
2. **Without** skills (baseline)

Each configuration uses `--trials 5` on the eval task by default.

## Eval tasks

| Task | Exercises |
|------|-----------|
| `eval-cli-echo.json` | `zero-cli-pattern` |
| `eval-file-sum.json` | `zero-stdin-pipeline-pattern` |

Copy or extend tasks from `zero-agent-bench/tasks/` as needed.

## Reporting

Paste the printed markdown table into your PR under `## Evaluation`, including `zero --version` used during development.
