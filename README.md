# zero-skills

A community cookbook of agent-facing pattern skills for [Zero](https://zerolang.ai).

- **Language:** [zerolang.ai](https://zerolang.ai) · [Getting started](https://zerolang.ai/getting-started)
- **Benchmark:** [HKTITAN/zero-agent-bench](https://github.com/HKTITAN/zero-agent-bench) · [Full results](https://github.com/HKTITAN/zero-agent-bench/blob/main/results/RESULTS.md)
- **Upstream:** [vercel-labs/zero](https://github.com/vercel-labs/zero)

The Zero compiler already ships eight language-feature skills (`zero`, `zero-language`, `zero-stdlib`, `zero-diagnostics`, `zero-builds`, `zero-packages`, `zero-testing`, `zero-agent`). Those describe the language itself.

This repo ships **pattern skills** — concise, runnable recipes that teach agents how to *compose* Zero features into specific kinds of programs. Where the official skills answer "what is `raises` for", these answer "how do I write a CLI in Zero that reads args, transforms input, and exits with a useful code?"

## The starter set

| Skill | What it teaches |
|---|---|
| [`zero-cli-pattern`](skills/zero-cli-pattern.md) | Build a CLI that parses args, exits with a code, prints to `world.out` and `world.err` |
| [`zero-stdin-pipeline-pattern`](skills/zero-stdin-pipeline-pattern.md) | Read stdin line by line, transform, write to stdout |
| [`zero-fix-loop-pattern`](skills/zero-fix-loop-pattern.md) | Use `zero check --json`, `zero explain`, and `zero fix --plan --json` to recover from compile failures |
| [`zero-data-shapes-pattern`](skills/zero-data-shapes-pattern.md) | Model data with `shape`, `enum`, `choice`, and `Maybe` — and pattern match exhaustively |
| [`zero-error-handling-pattern`](skills/zero-error-handling-pattern.md) | Idiomatic `raises { ... }`, `check`, and `Maybe<T>` propagation |

Each skill is a single Markdown file with the same YAML frontmatter as official Zero skills (`name`, `description`), and follows the compact "code first, prose to clarify" structure the compiler uses.

## Why community skills?

The Zero CLI's own [`zero` skill](https://github.com/vercel-labs/zero) tells agents to load the version-matched skills shipped with the compiler. Those are authoritative for language semantics. But agents in the wild solve real problems that span multiple language features at once — and a focused pattern recipe in the system prompt can lift pass rates measurably.

Every skill in this repo has an **evaluation fixture**: a small benchmark task and a side-by-side comparison of agent pass rate with vs. without the skill loaded. We use [`zero-agent-bench`](https://github.com/HKTITAN/zero-agent-bench) as the harness. If a proposed skill does not measurably improve agent outcomes on its target task, it does not get merged.

See [`evals/README.md`](evals/README.md) for the evaluation methodology and how to reproduce.

## Using a skill

Skills are plain Markdown. Two ways to use them:

1. **In an agent system prompt.** Drop the body into your agent's system message before sending the user's task.

   ```ts
   import { readFile } from "node:fs/promises";
   const skill = await readFile("zero-skills/skills/zero-cli-pattern.md", "utf8");
   const system = `${BASE_SYSTEM}\n\n${skill}`;
   ```

2. **As a Claude Code / Cursor / Cline skill.** Drop the file into your editor's skill directory.

## Contributing a skill

A pattern skill must:

1. **Solve a real recurring task.** Not "everything about generics" — instead, "how to write a CLI that exits non-zero on bad input."
2. **Be self-contained.** A single Markdown file, < 200 lines, with at least one complete runnable Zero program.
3. **Cite official skills, don't duplicate them.** Link to `zero-language` for syntax basics rather than re-explaining them.
4. **Ship an evaluation.** Add a benchmark task to [`evals/`](evals/) and report agent pass rate with vs. without the skill across at least two model tiers (e.g. Sonnet 4.6 and Haiku 4.5).
5. **Pass `scripts/validate.mjs`.** Validates the frontmatter, checks that every fenced ```` ```zero ```` block compiles with `zero check`.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full process.

## Format

Each skill file:

```markdown
---
name: zero-cli-pattern
description: Build a Zero CLI that parses args, exits with a code, and prints to world.out and world.err.
---

# Zero CLI Pattern

Use this when the user wants a self-contained command-line tool in Zero…

## Minimum runnable program

```zero
use std.args

pub fun main(world: World) -> Void raises {
    let first = std.args.get(1)
    if !first.has {
        check world.err.write("usage: tool <arg>\n")
        return
    }
    check world.out.write(first.value)
    check world.out.write("\n")
}
```

## Common pitfalls

1. …

## See also

- `zero-language` (official) — shape and choice syntax
- `zero-stdlib` (official) — `std.args.get` semantics
```

## License

Apache-2.0, matching the upstream Zero project.

## Relationship to vercel-labs/zero

This is an independent community repo. It is not affiliated with Vercel or the Zero maintainers. If the Zero project later ships analogous pattern skills upstream, this repo will defer to them and either deprecate or pivot to skills that complement rather than overlap.
