# PDFDTP — Document Transaction Protocol (for PDF)

**Request/response protocol for transactional document editing, designed
for AI agents.** Where current tooling answers "ok", a conforming engine
answers with a **certificate**: machine-checkable proof of what the edit
did — and the data to undo it.

- **Spec:** [SPEC.md](SPEC.md) — version 1.0 (Stable)
- **License:** [Apache-2.0](LICENSE) — implementations are free, including commercial
- **Reference implementation:** [pdfbadger](https://github.com/fjjjuv/pdfbadger)
- **Author:** [fjjjuv](https://github.com/fjjjuv)

## Why

An agent cannot prove an edit did what it claimed, cannot undo it, and
must re-analyze the file from scratch every session. DTP fixes that:

- **contract** — the agent declares what may be touched *before* the edit;
- **certificate** — the engine proves *after* the edit that only the
  allowed nodes changed (`touched`, `untouched_changed`,
  `render_diff_zones`);
- **journal_entry** — a hash-chained record with `inverse_ops`, enabling
  audit and rollback without snapshots.

DTP is transport-agnostic: it rides on MCP `tools/call`, stdio, HTTP, or
in-process calls. `"dcp": "1.0"` is REQUIRED in every request.

## Related specifications

| Spec | Repo | Relation |
|---|---|---|
| PDFSP — PDF Scene Patch | [fjjjuv/pdfsp](https://github.com/fjjjuv/pdfsp) | The op vocabulary carried in `ops` (SPEC §3) — PDFSP/1.0 |
| PDFAD — PDF Agent Descriptor | [fjjjuv/pdfad](https://github.com/fjjjuv/pdfad) | `journal_head` and `capabilities` in the manifest reflect DTP state |

**Compatibility:** DTP/1.0 requires PDFSP/1.0 ops. Documents produced by
DTP-aware engines SHOULD expose `journal_head` per PDFAD/1.0 §3.

## Examples

- [`examples/request.json`](examples/request.json) — a transaction
  request with contract, journal and strict mode
- [`examples/response.json`](examples/response.json) — the conforming
  response: certificate + journal entry

## Contributing

Spec changes: see [CONTRIBUTING.md](CONTRIBUTING.md). Issues and pull
requests welcome.
