# Contributing a Zero pattern skill

A pattern skill is a short Markdown file that, when injected into an agent's system prompt, measurably improves the agent's ability to write Zero code for a specific recurring task.

This document is the bar for merging.

## 1. Decide whether your idea is a pattern skill

A pattern skill is not:

- **A language reference.** Use the official `zero-language` skill shipped with the compiler.
- **A stdlib documentation page.** Use the official `zero-stdlib` skill.
- **A diagnostic catalog.** Use the official `zero-diagnostics` skill.
- **An advocacy piece.** Don't try to sell the language; teach a specific task.

A pattern skill *is*:

- A recipe for composing Zero features into a recognizable kind of program.
- Concise (target: < 200 lines of Markdown including code).
- Empirically validated on at least one task that agents otherwise fail or struggle on.

## 2. Write the skill

Use this template:

```markdown
---
name: zero-<topic>-pattern
description: One sentence. What does this skill teach the agent to do?
---

# Zero <Topic> Pattern

Use this skill when the user wants <specific kind of task>.

<2–3 sentence orienting paragraph: why this pattern matters, what feature combinations it touches.>

## Minimum runnable program

```zero
// A complete, runnable program. No omissions, no "…".
```

## Common pitfalls

1. <Pitfall name>. <One-line explanation and how to avoid it.>
2. …

## When this pattern does not apply

<2–3 lines: tell the agent when to NOT use this pattern.>

## See also

- `<other-skill>` — <one line>
```

Constraints:

- Every fenced `zero` code block MUST compile cleanly with `zero check`. The validation script enforces this.
- Use only features documented in the official `zero-language` and `zero-stdlib` skills, or link to where the feature is documented.
- Frontmatter `description` must be a single declarative sentence under 120 characters. It is how the agent decides whether to load the skill, so be specific.

## 3. Add an evaluation fixture

A pattern skill ships with proof.

1. Add a new task JSON in `evals/tasks/`, following the same schema as [`zero-agent-bench`](https://github.com/HKTITAN/zero-agent-bench) tasks. The task must exercise the pattern your skill teaches.
2. Run the evaluation harness:

   ```bash
   cd evals
   npm install
   export ANTHROPIC_API_KEY=sk-ant-...
   npm run eval -- --skill zero-<topic>-pattern --task <task-id>
   ```

   This runs 5 trials of the task with the skill loaded and 5 without, across at least Sonnet 4.6 and Haiku 4.5.
3. Copy the resulting markdown table into the bottom of your skill PR under a `## Evaluation` heading.

A skill ships only if at least one of these is true:

- **Pass rate improves by ≥ 20 percentage points** on at least one model tier.
- **Mean attempts-to-green decreases by ≥ 0.5** on at least one model tier with no pass-rate regression.
- **Mean output tokens per successful run decreases by ≥ 20%** with no pass-rate regression.

If none of these hold, the skill is not yet earning its place in the system prompt budget.

## 4. Open the PR

Title: `Add zero-<topic>-pattern skill`.

PR body must include:

- The skill's frontmatter `description` verbatim.
- The evaluation table.
- A note on which Zero version (`zero --version`) you developed and tested against.

## 5. Reviewer checklist

Maintainers verify:

- [ ] Frontmatter valid; description under 120 chars.
- [ ] All `zero` code blocks compile with `zero check` against the declared version.
- [ ] Evaluation reproduces locally.
- [ ] Skill does not duplicate an official Zero skill.
- [ ] No advocacy, no hedging — direct, executable guidance only.

## Versioning

Skills are pinned to a major Zero version via the `requires` line in the README skill table. When a new Zero release lands, we re-run all evaluations. Skills that no longer demonstrate measurable improvement are deprecated.
