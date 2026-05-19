---
name: zero-fix-loop-pattern
description: Use zero check --json and zero explain to fix compile errors before rewriting code.
---

# Zero Fix Loop Pattern

Use when agent-generated Zero fails `zero check`. Read structured diagnostics first; avoid guessing syntax.

## Agent workflow (shell)

```sh
zero check --json solution.0
zero explain PAR100
zero fix --plan --json solution.0
```

`zero fix` is plan-only: it returns candidate edits but does not apply them. Apply the smallest change justified by the span, then re-run the same command.

## Minimum runnable program

```zero
pub fun main(world: World) -> Void raises {
    check world.out.write("fix loop ok\n")
}
```

After a failure, inspect `code`, `line`, `column`, and `help` from JSON. Example fields: `PAR100` (parser), `NAM003` (unknown name), `STD002` (unknown std helper), `CGEN004` (direct backend limitation).

## Common pitfalls

1. **Scraping terminal prose** — use `--json` output.
2. **Broad refactors on first error** — fix the earliest diagnostic span.
3. **Ignoring `CGEN004`** — direct backend may reject runtime `std.parse` on arguments; switch to manual digit parsing.

## See also

- `zero-diagnostics` (official) — diagnostic catalog and fix safety levels
