# Bug Report

## SEED

1. **Bug ID & Title:** CM-BUG-001 — Sample seed data is not loaded during normal setup
2. **Location & Steps to Reproduce:** `server.js`, `seed.js`, and the setup instructions in `README.md`. Configure `MONGODB_URI` for an empty development database and start the API with `npm start`. The server starts without adding the sample data; the manual seed command was not documented.
3. **Expected vs. Actual Result:** Expected: setup instructions explain how to load sample data safely. Actual: API startup does not invoke the seed script, and the seed command was not explained; additionally, the old script cleared all records in its target collections before inserting fixtures.
4. **Severity & Evidence:** **Medium.** Code inspection confirmed that `server.js` only connects to MongoDB and starts the API, while `package.json` exposes seeding as a separate command. The previous `seed.js` implementation deleted all documents from five collections. No screenshot or runtime database error was captured.
5. **Fix & Verification Status:** **Fixed & Verified.** Documented the manual `npm run seed` workflow, changed fixture writes to insert-only upserts so existing records are neither cleared nor overwritten, and ran the available syntax and repository checks. The seed command was not run against a database because no target database was specified.

## Login

1. **Bug ID & Title:** CM-BUG-002 — Login compares plaintext passwords to bcrypt hashes
2. **Location & Steps to Reproduce:** `src/services/auth.service.js`, `login`. Create or seed a user, then attempt to log in with the account's correct plaintext password.
3. **Expected vs. Actual Result:** Expected: login verifies the provided password against the stored bcrypt hash and issues a token on a match. Actual: login compared the plaintext password directly to the bcrypt hash, so valid credentials were rejected.
4. **Severity & Evidence:** **High.** All users with bcrypt-hashed passwords were unable to authenticate through this login flow. The issue was confirmed by code inspection; no screenshot or database error was captured.
5. **Fix & Verification Status:** **Fixed & Verified.** Login now uses `bcrypt.compare` to verify the plaintext password against `user.passwordHash`, and the temporary match logging was removed. Syntax and bcrypt comparison checks passed; no database-backed login was run.

## Authentication middleware

1. **Bug ID & Title:** CM-BUG-003 — Invalid JWTs pass authentication middleware
2. **Location & Steps to Reproduce:** `src/middlewares/authMiddleware.js` and `src/controllers/auth.controller.js`. Send a request to `GET /api/auth/me` with a malformed, expired, or otherwise invalid `Authorization` token.
3. **Expected vs. Actual Result:** Expected: authentication middleware returns `401 Unauthorized` and stops the request. Actual: JWT verification errors called `next()` without setting `req.user`; the `/me` controller then accessed `req.user.id` and threw `TypeError: Cannot read properties of undefined (reading 'id')`.
4. **Severity & Evidence:** **Medium.** Invalid credentials caused an unhandled controller error instead of a clear authentication response. The reported stack trace and the middleware's catch branch confirm the path.
5. **Fix & Verification Status:** **Fixed & Verified.** Invalid or expired JWTs now receive `401`; decoded tokens without an ID are also rejected, and the stray user-ID console log was removed. Middleware behavior and JavaScript syntax checks passed.

## Enrollment

1. **Bug ID & Title:** CM-BUG-004 — New course enrollments are rejected
2. **Location & Steps to Reproduce:** `src/services/enrollment.service.js`, `enrollCourse`. Ensure a course exists and the student has no enrollment record for it, then request enrollment in that course.
3. **Expected vs. Actual Result:** Expected: a student without an existing enrollment can enroll, while a duplicate enrollment is rejected. Actual: the service threw `"Already enrolled in this course"` when no enrollment existed, preventing new enrollments.
4. **Severity & Evidence:** **High.** Students could not enroll in courses through this service unless an enrollment already existed. The inverted enrollment check confirms the behavior.
5. **Fix & Verification Status:** **Fixed.** The duplicate-enrollment guard now throws only when an enrollment record exists. JavaScript syntax validation passed; no database-backed enrollment flow was run.

## Quiz submission

1. **Bug ID & Title:** CM-BUG-005 — Quiz scores report incorrect percentages and accept invalid answers
2. **Location & Steps to Reproduce:** `src/services/quiz.service.js`, `submitQuiz`. Submit answers to a quiz and inspect the returned `percent`; also try a missing/non-array answer list or an option index outside the question's options.
3. **Expected vs. Actual Result:** Expected: percentage is calculated on a 0–100 scale and submitted answers are valid option indices. Actual: the service multiplied the score ratio by 10, reporting a maximum of 10 instead of 100; it also accepted malformed or out-of-range answers, which could be stored and scored incorrectly.
4. **Severity & Evidence:** **Medium.** Incorrect percentages affect submission results and quiz statistics, while invalid answers can produce misleading persisted scores. The calculation and missing answer validation were confirmed by code inspection.
5. **Fix & Verification Status:** **Fixed.** Percentage calculation now uses a 100-point scale, and submissions validate the answer array and each provided option index. Syntax checks and focused service-level checks passed; no database-backed submission was run.

## Admin service

1. **Bug ID & Title:** CM-BUG-006 — Admin assignment filters are ignored and updates bypass schema validation
2. **Location & Steps to Reproduce:** `src/controllers/admin.controller.js` and `src/services/admin.service.js`. Request `GET /api/admin/assignments?courseId=<id>` or update a course/assignment with a value that violates its Mongoose schema.
3. **Expected vs. Actual Result:** Expected: assignment filtering applies to the stored `course` field and invalid updates are rejected. Actual: the service filtered on nonexistent `courseId`, while the controller did not forward query parameters; update operations also omitted Mongoose's `runValidators` option.
4. **Severity & Evidence:** **Medium.** Admins could not filter assignment submissions by course, and invalid schema values could be persisted through update endpoints. The filter/schema mismatch and default update-validator behavior were confirmed by code inspection.
5. **Fix & Verification Status:** **Fixed.** The controller now forwards query parameters, assignment queries filter by `course`, and course/assignment updates run schema validators. Syntax checks and focused service checks passed; no database-backed admin requests were run.
