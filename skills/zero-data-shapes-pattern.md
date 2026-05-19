---
name: zero-data-shapes-pattern
description: Model data with shape and choice types and use exhaustive match in Zero.
---

# Zero Data Shapes Pattern

Use when the task needs structured records or tagged unions (e.g. sort keys, optional values, command results).

## Minimum runnable program

```zero
shape Pair {
    lo: i32,
    hi: i32,
}

enum Tri {
    yes,
    no,
}

pub fun main(world: World) -> Void raises {
    let p = Pair { lo: 1, hi: 3 }
    let t = Tri.yes
    if t == Tri.yes {
        check world.out.write("ok\n")
    } else {
        check world.out.write("no\n")
    }
}
```

## Common pitfalls

1. **Non-exhaustive `match`** — include every choice case or a `_` fallback arm.
2. **`else if` chains** — nest `if` / `else { if ... }` instead.
3. **Choice payload syntax** — use `Result.ok(42)` style per the language skill.

## See also

- `zero-language` (official) — `shape`, `enum`, `choice`, `match`
