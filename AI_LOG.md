# AI_LOG.md

## 1. Purpose

AI tools were used as development assistants during the project, mainly for
research, debugging, code suggestions, and reviewing implementation decisions.

I remained responsible for deciding the final architecture, integrating the
code, testing the application, and correcting issues found during development.

---

## 2. Tools Used

### ChatGPT

I used ChatGPT mainly for:

- Breaking the assignment requirements into implementation tasks.
- Discussing the application architecture and frontend/backend responsibilities.
- Understanding and checking the pricing formula.
- Debugging development issues and API behaviour.
- Reviewing edge cases around dynamic configuration and historical leads.
- Structuring project documentation such as `README.md` and `DECISIONS.md`.

ChatGPT was also useful when I was unsure whether a particular implementation
decision was appropriate for the assignment.

### Claude

I used Claude mainly as a second coding/review assistant for:

- Reviewing backend structure.
- Suggesting improvements to controllers, services, and API organisation.
- Reviewing dynamic configuration handling.
- Checking larger pieces of code for possible issues or simplifications.

I treated these suggestions as recommendations and tested/modified them before
using them in the project.

### GitHub Copilot

Copilot was mainly used for smaller coding tasks and boilerplate, such as:

- Express route/controller boilerplate.
- Mongoose model structures.
- Repetitive JavaScript code.
- Small React component/code completions.
- Minor syntax corrections.

The generated suggestions were reviewed and adapted to fit the existing
application rather than being accepted blindly.

---

## 3. Official Documentation / References

For implementation details, I also referred to official documentation rather
than relying only on AI-generated answers.

Examples included:

- MongoDB / Mongoose documentation for database connection and models.
- Express documentation for API/server behaviour.
- JWT/package documentation for authentication-related implementation.
- React/Vite documentation for frontend setup and behaviour.

This was especially useful for checking API/library syntax and configuration.

---

## 4. Example of Incorrect AI Output

One example was around the pricing calculation.

An AI suggestion initially treated the range value directly as a decimal,
while the provided seed data stores the range as `12` to represent `12%`.

Using `12` directly would produce an incorrect estimate.

I checked the actual seed data and the intended business meaning, then changed
the calculation so that the stored value is explicitly converted:

```js
const spread = config.globalModifiers.rangeSpread / 100;
```

### Historical Lead Data

An AI suggestion initially assumed that all leads should follow the current estimator question structure.

This did not fit the supplied seed data because some historical leads belong to older configuration versions and contain answers that are not part of the current question set.

I kept the lead answers flexible and preserved the historical data instead of forcing old leads into the current schema.

This also works with configuration versioning, since each lead keeps the version that was used when its estimate was created.
