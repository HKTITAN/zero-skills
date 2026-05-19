---
name: zero-cli-pattern
description: Build a Zero CLI that reads args with std.args, parses digits manually, and writes to world.out.
---

# Zero CLI Pattern

Use when the user wants a command-line program that reads arguments and prints results to stdout.

Zero 0.1.x direct executables work best with **all I/O in `main`** (no helper functions that take `World`). Parse numeric args with **string indexing** (`arg[i]`), not `std.parse` on runtime strings.

## Minimum runnable program

```zero
use std.args

pub fun main(world: World) -> Void raises {
    let first = std.args.get(1)
    if first.has {
        check world.out.write(first.value)
        check world.out.write("\n")
    } else {
        check world.out.write("missing\n")
    }
}
```

## Parsing a non-negative decimal argument

```zero
use std.args
use std.mem

pub fun main(world: World) -> Void raises {
    let arg = std.args.get(1)
    if arg.has {
        let mut value: u32 = 0_u32
        let len = std.mem.len(arg.value)
        let mut i: usize = 0
        while i < len {
            let ch = arg.value[i]
            if ch >= 48_u8 {
                if ch <= 57_u8 {
                    value = value * 10_u32 + ((ch - 48_u8) as u32)
                    i = i + 1
                } else {
                    i = len
                }
            } else {
                i = len
            }
        }
        check world.out.write("ok\n")
    }
}
```

## Common pitfalls

1. **`!arg.has` fails to parse** — use `if arg.has { ... } else { ... }` instead of negation.
2. **`else if` chains fail** — nest `if` / `else { if ... }` blocks.
3. **`std.parse.parseU32(arg.value)` fails at link time** — literals only on the direct backend; parse digits manually.
4. **Helper `fun f(world: World, ...)` fails at link time** — keep `world.out.write` calls inside `main`.

## See also

- `zero-language` (official) — `raises`, `check`, types
- `zero-stdlib` (official) — `std.args`, `std.mem`
