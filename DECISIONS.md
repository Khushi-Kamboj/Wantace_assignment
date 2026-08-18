# Northline Roofing & Exteriors — Key Decisions

This document explains the main technical decisions made while building the roofing estimator, along with a few assumptions made from the provided seed data.

## 1. Stack & Database

### Decision

I used:

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **API:** REST

### Why?

React works well for this project because the estimator is configuration-driven. The questions are loaded from the database, so the frontend can render different question types without hardcoding every question.

Node/Express keeps the backend simple and is enough for the API, validation, authentication, lead storage, and pricing calculation.

I chose MongoDB because the configuration is flexible. Questions can have different fields depending on their type, and future questions can be added without changing the database structure each time. Leads also store answers as a flexible object.

The database is therefore the source of truth for questions, pricing, multipliers, modifiers, configuration versions, and leads.

---

## 2. Why Pricing Is Calculated on the Backend

The frontend only collects the customer's answers and sends them to:

`POST /api/estimate`

The backend validates the answers, calculates the estimate, stores the lead, and returns the result.

I intentionally kept the calculation on the server because pricing should not depend on values or logic that can be changed in the browser.

Frontend validation is still used for a better user experience, but the backend is always the final authority.

---

## 3. Pricing Formula

In simple terms, the estimate works like this:

```text
Material Cost
+ Waste
+ Tear-Off Cost
        ↓
Adjust for Pitch & Stories
        ↓
+ Permit Fee
        ↓
Mid Estimate
        ↓
Apply Range %
        ↓
Low / High Estimate
```

```text
Material Cost = Roof Area × Material Rate × (1 + Waste)

Tear-Off Cost = Roof Area × Tear-Off Rate

Adjusted Subtotal =
(Material Cost + Tear-Off Cost) × Pitch Multiplier × Stories Multiplier

Mid Estimate = Adjusted Subtotal + Permit Fee

Low = Mid Estimate × (1 - Range %)

High = Mid Estimate × (1 + Range %)
```

The current seed values use:

- Waste: 10%
- Permit fee: $350
- Range spread: 12%

One small data issue is that the database stores the range spread as `12`, while the calculation needs `0.12`. The calculator explicitly converts it before using it.

---

## 4. Configuration Versioning

Every time the owner saves a configuration change, the configuration version increases.

For example:

`Version 3 → pricing changed → Version 4`

Each lead stores the version that was used to calculate its estimate.

This is important because a lead created under Version 3 should still show Version 3 even after newer pricing becomes active.

---

## 5. Seed Data / Legacy Data

The provided seed data contains a few inconsistencies that I chose to handle without rewriting the historical data.

Some older leads use previous configuration versions and contain answers that are not part of the current question set. I kept those answers because they are still useful historical information.

Some numeric values are also provided as strings, such as `"1.12"`. These are converted to actual numbers before being used in calculations.

The goal was to preserve the supplied data while making sure the current application handles it safely.

---

## 6. What I Kept Out of Scope

I intentionally did not add features that were not necessary for this assignment.

Examples:

- Complex role/permission systems
- Multi-tenancy
- Customer accounts
- Payments
- CRM integrations
- Advanced analytics
- Automated email/SMS campaigns
- Complex quote/invoice generation
- Advanced audit logging

For example, the current owner panel assumes a single admin-level user. If Northline later needs different roles for owners, managers, or sales staff, role-based permissions can be added.

Similarly, multi-tenancy was not needed because this application currently represents one business and one configuration.

Keeping these out of scope helped keep the implementation focused on the actual estimator and owner workflow.

---

## 7. Questions I Would Ask Dale Before Production

Before using this as a production quoting tool, I would confirm a few business rules with Dale:

### Pricing

- Is the current pricing formula exactly how Northline wants estimates calculated?
- Should the 10% waste factor apply only to material?
- Should pitch and stories multipliers affect the complete subtotal?
- Is the $350 permit fee always applicable?
- Is the 12% range fixed, or should it vary by project?
- Are taxes, disposal fees, or any other charges missing?

### Configuration & Leads

- Who should be allowed to change pricing in production?
- Should configuration changes be reversible/rollback-able?
- Should configuration changes have an audit history?
- Should historical leads ever be editable?

### Users & Production

- Will there be only one owner account or multiple users?
- If multiple users are needed, what permissions should they have?
- How long should lead/customer data be retained?
- What backup and recovery process should be used for leads?

---

## 8. Final Note

The main design goal was to keep the application simple while making the important business rules configurable and safe.

The frontend handles the user experience, while the backend owns validation, pricing, configuration, authentication, and lead storage. This also means pricing or estimator questions can be changed without modifying the frontend code.
