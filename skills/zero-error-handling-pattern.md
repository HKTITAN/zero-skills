---
name: zero-error-handling-pattern
description: Use raises, check, and Maybe.has to handle fallible Zero operations idiomatically.
---

# Zero Error Handling Pattern

Use when a function can fail (I/O, parsing, invalid input) and callers must propagate or handle errors explicitly.

## Minimum runnable program

```zero
fun parse_flag(ok: Bool) -> Void raises { InvalidInput } {
    if ok {
        return
    }
    raise InvalidInput
}

pub fun main(world: World) -> Void raises { InvalidInput } {
    check parse_flag(true)
    check world.out.write("ok\n")
}
```

## Maybe from std.args

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

## Common pitfalls

1. **Calling fallible functions without `check`** in a `raises` function triggers `ERR003`.
2. **Using `!maybe.has`** — branch on `.has` positively instead.
3. **Open `raises` when a fixed error set is enough** — prefer `raises { InputError }` for clarity.

## See also

- `zero-language` (official) — `raises`, `check`, `raise`
- `zero-stdlib` (official) — `Maybe<T>` from `std.args.get`
