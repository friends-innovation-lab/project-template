# Vendor Inventory — [PROJECT NAME]

<!--
This template implements ENTERPRISE-READINESS.md → "Vendor management"
Projects must track all third-party vendors that handle project data.
Update this document when adding or removing vendors.
-->

## Overview

| Metric                  | Value      |
| ----------------------- | ---------- |
| Last updated            | YYYY-MM-DD |
| Reviewed by             | Name       |
| Total vendors           | N          |
| Vendors with PII access | N          |
| All DPAs signed         | Yes/No     |

## Vendor inventory

| Vendor        | Service        | Data Shared          | Data Region | DPA Signed | SOC 2   | Contact              |
| ------------- | -------------- | -------------------- | ----------- | ---------- | ------- | -------------------- |
| Vercel        | Hosting        | Logs, static assets  | US          | Yes        | Type II | support@vercel.com   |
| Supabase      | Database       | All user data        | US (or EU)  | Yes        | Type II | support@supabase.com |
| Sentry        | Error tracking | Error data, user IDs | US          | Yes        | Type II | support@sentry.io    |
| Resend        | Email          | Email addresses      | US          | Yes        | —       | support@resend.com   |
| Upstash       | Rate limiting  | IP addresses, tokens | US          | Yes        | —       | support@upstash.com  |
| [Add rows...] |                |                      |             |            |         |                      |

## Vendor categories

### Infrastructure

| Vendor   | Purpose        | Criticality |
| -------- | -------------- | ----------- |
| Vercel   | Hosting, CDN   | Critical    |
| Supabase | Database, Auth | Critical    |
| Upstash  | Rate limiting  | Medium      |

### Development tools

| Vendor | Purpose        | Data Access |
| ------ | -------------- | ----------- |
| GitHub | Source control | Code only   |

### Analytics & monitoring

| Vendor | Purpose        | Data Collected       |
| ------ | -------------- | -------------------- |
| Sentry | Error tracking | Error data, user IDs |

### Communication

| Vendor | Purpose             | Data Shared     |
| ------ | ------------------- | --------------- |
| Resend | Transactional email | Email addresses |

## Compliance requirements by vendor

| Vendor   | GDPR | SOC 2   | HIPAA     | FedRAMP |
| -------- | ---- | ------- | --------- | ------- |
| Vercel   | Yes  | Type II | —         | —       |
| Supabase | Yes  | Type II | Available | —       |
| Sentry   | Yes  | Type II | —         | —       |
| Resend   | Yes  | —       | —         | —       |

## Data Processing Agreements

| Vendor        | DPA Link | Signed Date | Renewal Date    |
| ------------- | -------- | ----------- | --------------- |
| Vercel        | [Link]   | YYYY-MM-DD  | N/A (evergreen) |
| Supabase      | [Link]   | YYYY-MM-DD  | N/A (evergreen) |
| [Add rows...] |          |             |                 |

## Vendor review process

Per ENTERPRISE-READINESS.md:

1. **Before adding a vendor:**
   - Security review (SOC 2, penetration test results)
   - Privacy review (DPA, data handling practices)
   - Legal review for contracts over $X
   - Document in this inventory

2. **Ongoing:**
   - Annual review of vendor compliance status
   - Monitor for security incidents
   - Review data sharing against current needs

3. **Vendor removal:**
   - Confirm data deletion/return
   - Revoke API keys and access
   - Update this inventory

## Emergency contacts

| Vendor        | Security Contact      | SLA |
| ------------- | --------------------- | --- |
| Vercel        | security@vercel.com   | 24h |
| Supabase      | security@supabase.com | 24h |
| [Add rows...] |                       |     |
