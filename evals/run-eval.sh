#!/usr/bin/env bash
set -euo pipefail

SKILL_NAME="${1:?usage: run-eval.sh <skill-name> <task-id>}"
TASK_ID="${2:?usage: run-eval.sh <skill-name> <task-id>}"
TRIALS="${TRIALS:-5}"
MODEL="${MODEL:-claude-sonnet-4-6}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BENCH_ROOT="$(cd "$SKILLS_ROOT/../zero-agent-bench" && pwd)"
SKILL_FILE="$SKILLS_ROOT/skills/${SKILL_NAME}.md"
TASK_FILE="$SCRIPT_DIR/tasks/${TASK_ID}.json"

if [[ ! -f "$SKILL_FILE" ]]; then
  echo "missing skill: $SKILL_FILE" >&2
  exit 1
fi
if [[ ! -f "$TASK_FILE" ]]; then
  echo "missing task: $TASK_FILE" >&2
  exit 1
fi
if [[ ! -d "$BENCH_ROOT" ]]; then
  echo "missing bench checkout: $BENCH_ROOT" >&2
  exit 1
fi

mkdir -p "$BENCH_ROOT/tasks"
cp "$TASK_FILE" "$BENCH_ROOT/tasks/${TASK_ID}.json"

cd "$BENCH_ROOT"

echo "=== With skill: $SKILL_NAME ==="
npm run bench -- \
  --model "$MODEL" \
  --languages zero \
  --filter "$TASK_ID" \
  --trials "$TRIALS" \
  --skill-file "$SKILL_FILE" \
  --skill-only \
  --max-attempts 3

echo ""
echo "=== Baseline (no skills) ==="
npm run bench -- \
  --model "$MODEL" \
  --languages zero \
  --filter "$TASK_ID" \
  --trials "$TRIALS" \
  --skip-zero-skills \
  --max-attempts 3

echo ""
echo "Compare pass rates in the latest results/raw/*/ directories."
