---
name: zero-stdin-pipeline-pattern
description: Read a text file from an argv path with std.fs.readAll and scan bytes in main.
---

# Zero Stdin / File Pipeline Pattern

Use when input arrives as **lines in a file** (benchmark harness passes `input.txt` as `argv[1]` when stdin is simulated).

Hosted stdin APIs are limited in Zero 0.1.x; read the path from `std.args.get(1)` and load bytes with `std.fs.readAll`.

## Minimum runnable program

```zero
use std.args
use std.fs
use std.mem

pub fun main(world: World) -> Void raises {
    let path_arg = std.args.get(1)
    if path_arg.has {
        let fs = std.fs.host()
        let mut storage: [256]u8 = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ]
        let mut alloc = std.mem.fixedBufAlloc(storage)
        let body = std.fs.readAll(alloc, fs, path_arg.value, 256)
        if body.has {
            let mut buf: owned<ByteBuf> = body.value
            let bytes = std.mem.bufBytes(&buf)
            let len = std.mem.bufLen(&buf)
            check world.out.write("read ok\n")
        }
    }
}
```

## Common pitfalls

1. **`world.stdin` does not exist** — use a file path argument plus `std.fs.readAll`.
2. **`world.in.read` may not link on direct backend** — prefer `readAll` + `bufBytes`.
3. **Array literal length must match type** — `[256]u8` needs exactly 256 elements (or use a smaller buffer size).

## See also

- `zero-cli-pattern` — argument handling
- `zero-stdlib` (official) — `std.fs`, `std.mem`
