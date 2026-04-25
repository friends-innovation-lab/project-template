# Data Inventory — [PROJECT NAME]

<!--
This template implements DATA-GOVERNANCE.md → "Data inventory requirements"
Projects maintain this inventory to track what data they collect, store, and process.
Update this document whenever data handling changes.
-->

## Overview

| Metric                  | Value      |
| ----------------------- | ---------- |
| Last updated            | YYYY-MM-DD |
| Reviewed by             | Name       |
| Total data types        | N          |
| Contains PII            | Yes/No     |
| Contains sensitive data | Yes/No     |

## Data inventory

| Data Type      | Source      | Storage Location          | Retention                  | Classification | Encryption        | Access Control |
| -------------- | ----------- | ------------------------- | -------------------------- | -------------- | ----------------- | -------------- |
| User email     | User input  | Supabase `profiles.email` | Account lifetime + 30 days | PII            | At rest + transit | Auth required  |
| Session tokens | Auth system | Supabase Auth             | 24 hours                   | Internal       | Transit           | System only    |
| [Add rows...]  |             |                           |                            |                |                   |                |

## Classification definitions

Per DATA-GOVERNANCE.md:

- **Public** — Can be shared freely (marketing content, public docs)
- **Internal** — Business data, not for external sharing (analytics, logs)
- **Confidential** — Sensitive business data (financials, contracts)
- **PII** — Personally identifiable information (names, emails, addresses)
- **Sensitive PII** — High-risk PII (SSN, financial accounts, health data)

## Retention policies

| Classification | Default Retention          | Deletion Method               |
| -------------- | -------------------------- | ----------------------------- |
| Public         | Indefinite                 | N/A                           |
| Internal       | 2 years                    | Automated purge               |
| Confidential   | 7 years                    | Manual review + secure delete |
| PII            | Account lifetime + 30 days | Automated on account deletion |
| Sensitive PII  | Minimum required by law    | Secure delete + audit log     |

## Data flows

<!-- Diagram or description of how data moves through the system -->

```
User Input → API → Database
                ↓
           Analytics (anonymized)
```

## Third-party data sharing

See [vendors.md](vendors.md) for the full vendor inventory.

| Vendor        | Data Shared  | Purpose | DPA Signed |
| ------------- | ------------ | ------- | ---------- |
| Vercel        | Request logs | Hosting | Yes        |
| [Add rows...] |              |         |            |

## Compliance notes

- [ ] GDPR data subject rights implemented (access, deletion, portability)
- [ ] Data minimization reviewed — only collecting what's needed
- [ ] Retention policies automated where possible
- [ ] Data processing agreements in place with all vendors handling PII
