# PII Inventory — [PROJECT NAME]

<!--
This template implements DATA-GOVERNANCE.md → "PII handling requirements"
Projects maintaining PII must track every field containing personal data.
Update this document whenever PII handling changes.
-->

## Overview

| Metric               | Value      |
| -------------------- | ---------- |
| Last updated         | YYYY-MM-DD |
| Reviewed by          | Name       |
| Total PII fields     | N          |
| Sensitive PII fields | N          |
| GDPR applicable      | Yes/No     |
| CCPA applicable      | Yes/No     |

## PII field inventory

| PII Field     | Table.Column     | Data Type | Encryption | Retention     | Lawful Basis        | Deletion Supported |
| ------------- | ---------------- | --------- | ---------- | ------------- | ------------------- | ------------------ |
| Email address | `profiles.email` | string    | At rest    | Account + 30d | Contract            | Yes                |
| Full name     | `profiles.name`  | string    | At rest    | Account + 30d | Contract            | Yes                |
| IP address    | `audit_log.ip`   | string    | None       | 90 days       | Legitimate interest | Yes (auto-purge)   |
| [Add rows...] |                  |           |            |               |                     |                    |

## Sensitive PII (elevated protection)

| PII Field        | Table.Column | Additional Controls | Access Logging |
| ---------------- | ------------ | ------------------- | -------------- |
| [None currently] |              |                     |                |

<!-- Examples of sensitive PII requiring elevated controls:
- Social Security Numbers
- Financial account numbers
- Health information
- Biometric data
- Government IDs
-->

## Lawful basis definitions

Per GDPR Article 6:

- **Consent** — User explicitly agreed to this processing
- **Contract** — Necessary to fulfill a contract with the user
- **Legal obligation** — Required by law
- **Vital interests** — Necessary to protect someone's life
- **Public task** — Necessary for public interest
- **Legitimate interest** — Business need balanced against user rights

## Data subject rights implementation

| Right                        | Implemented | Endpoint/Process               |
| ---------------------------- | ----------- | ------------------------------ |
| Right to access              | Yes/No      | `/api/user/data-export`        |
| Right to rectification       | Yes/No      | User profile settings          |
| Right to erasure             | Yes/No      | `/api/user/delete-account`     |
| Right to portability         | Yes/No      | `/api/user/data-export` (JSON) |
| Right to object              | Yes/No      | Unsubscribe links              |
| Right to restrict processing | Yes/No      | Support ticket                 |

## Cross-border transfers

| Destination    | Data Types       | Safeguard                    |
| -------------- | ---------------- | ---------------------------- |
| USA (Vercel)   | Request metadata | Standard contractual clauses |
| USA (Supabase) | All user data    | Standard contractual clauses |
| [Add rows...]  |                  |                              |

## PII access controls

| Role          | Access Level | Justification             |
| ------------- | ------------ | ------------------------- |
| System        | Full         | Application functionality |
| Admin         | Read         | Customer support          |
| Developer     | None (prod)  | No production PII access  |
| [Add rows...] |              |                           |

## Audit notes

- [ ] All PII fields documented above
- [ ] Encryption verified for all PII at rest
- [ ] Access controls reviewed and minimal
- [ ] Deletion processes tested
- [ ] Data subject request process documented
