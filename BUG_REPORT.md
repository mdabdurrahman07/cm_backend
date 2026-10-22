# Bug Report

1. **Bug ID & Title:** CM-BUG-001 — Sample seed data is not loaded during normal setup
2. **Location & Steps to Reproduce:** `server.js`, `seed.js`, and the setup instructions in `README.md`. Configure `MONGODB_URI` for an empty development database and start the API with `npm start`. The server starts without adding the sample data; the manual seed command was not documented.
3. **Expected vs. Actual Result:** Expected: setup instructions explain how to load sample data safely. Actual: API startup does not invoke the seed script, and the seed command was not explained; additionally, the old script cleared all records in its target collections before inserting fixtures.
4. **Severity & Evidence:** **Medium.** Code inspection confirmed that `server.js` only connects to MongoDB and starts the API, while `package.json` exposes seeding as a separate command. The previous `seed.js` implementation deleted all documents from five collections. No screenshot or runtime database error was captured.
5. **Fix & Verification Status:** **Fixed & Verified.** Documented the manual `npm run seed` workflow, changed fixture writes to insert-only upserts so existing records are neither cleared nor overwritten, and ran the available syntax and repository checks. The seed command was not run against a database because no target database was specified.
