# Contributing to PDFDTP

PDFDTP is a specification, not a codebase. Contributions are spec
changes: clarifications, new fields, edge-case rules, examples.

## How to propose a change

1. Open an issue describing the problem (what is ambiguous or missing).
2. For non-trivial changes, propose the diff in the issue first.
3. Pull requests must update `SPEC.md`, bump the version header if the
   change is breaking, and keep `examples/` valid.

## Rules

- Keep the protocol transport-agnostic: no MCP/HTTP-specific fields in
  the core format (transport bindings MAY be documented separately).
- Every MUST/SHOULD follows RFC 2119 semantics.
- `ops` inside a request MUST be valid PDFSP/1.0 ops — DTP does not
  redefine the op vocabulary.
- Examples must be a matching request/response pair.

Author: fjjjuv — https://github.com/fjjjuv
