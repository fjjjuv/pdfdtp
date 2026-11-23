# DTP — Document Transaction Protocol

**Version 1.0 — 2026-11-22**
Author: fjjjuv — https://github.com/fjjjuv
Status: Stable
License: Apache License 2.0 — implementations are free.

---

## 1. Abstract

DTP defines a **request/response protocol for transactional document
editing**, designed for AI agents. Where current MCP servers answer "ok",
a DTP engine answers with a **certificate**: machine-checkable proof of
what the edit did — and the data to undo it.

DTP is transport-agnostic: it can ride on MCP `tools/call`, stdio,
HTTP, or in-process calls.

## 2. Transaction lifecycle

```
agent ──► request  { dcp, ops, contract?, journal? }
engine ──► validate targets + contract preconditions
engine ──► apply ops atomically
engine ──► verify post-conditions
engine ──► emit certificate + journal_entry
agent ◄── response { ok, result, certificate, journal_entry }
```

Atomicity rule: if ANY verify check fails and the request asked
`"strict": true`, the engine MUST roll back and return
`ok: false` with `rolled_back: true`.

## 3. Request

```json
{
  "dcp": "1.0",
  "doc": "/abs/path.pdf",            // or doc handle per transport
  "ops": [ /* PDFSP ops */ ],
  "contract": {
    "only_touch": ["e12"],
    "max_mutations": 3
  },
  "journal": true,                    // embed provenance (default false)
  "strict": true                      // rollback on verify failure
}
```

## 4. Response

```json
{
  "ok": true,
  "result": { /* op-specific payload */ },
  "issues": [ {"kind": "...", "msg": "..."} ],
  "certificate": {
    "pre_sig":  "blake3:...",
    "post_sig": "blake3:...",
    "touched":  ["e12"],
    "untouched_changed": [],
    "render_diff_zones": []
  },
  "journal_entry": {
    "seq": 7,
    "ts": "2026-11-22T15:04:00Z",
    "ops_hash": "blake3:...",
    "inverse_ops": [ /* inverses, PDFSP format */ ],
    "chain_prev": "blake3:..."        // hash-chain: previous entry
  }
}
```

## 5. The certificate (proof of minimal mutation)

The certificate is the core innovation: it proves the engine mutated
**only** the allowed nodes.

- `touched` — element ids mutated
- `untouched_changed` — element ids that changed but were NOT authorized
  (MUST be empty for `ok: true` under `contract.only_touch`)
- `render_diff_zones` — page regions that differ visually pre/post

This is the "provable minimal mutation" property: an agent can *require*
a contract and *prove* compliance — for regulated documents.

## 6. The journal (edit provenance)

When `journal: true`, the engine embeds `journal_entry` in the document
itself (embedded file, XMP, or transport-defined sidecar). Entries form
a **hash-chain**: each entry's `chain_prev` points to the previous one —
tampering with history breaks the chain.

Journal enables:

- `audit` — read full edit history
- `rollback` — replay `inverse_ops` in reverse order to any seq

## 7. Errors

Typed issues, same vocabulary as PDFSP §9, plus:
`contract_violation`, `verify_failed`, `rolled_back`, `journal_corrupt`.

## 8. Semantics for agents

- An agent SHOULD send `contract` whenever the scope of an edit is known
- An agent SHOULD keep `journal_entry` for later audit/rollback
- An engine MUST NOT silently mutate outside contract scope
- An engine MUST return `certificate` — never claim success untested

## 9. Versioning

`"dcp": "1.0"` REQUIRED. Future versions may add fields; parsers MUST
ignore unknown top-level fields.

---

*DTP is published under Apache-2.0 to maximize adoption. The name "DTP"
is claimed by fjjjuv.*
