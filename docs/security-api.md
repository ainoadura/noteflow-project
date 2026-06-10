# API Security, SQL Injection Mitigation, and Environment Secrets

This document explains the core security principles implemented in **Page & Frame** to safeguard data persistence, prevent database manipulation, and shield infrastructure credentials from public exposure.

---

## 1. What is SQL Injection? (With a Concrete Example)

**SQL Injection (SQLi)** is a critical vulnerability that occurs when untrusted user input is directly concatenated into a database query string instead of being treated as isolated data. This allows an attacker to manipulate the query's structural logic and execute unauthorized SQL commands on the server.

### ❌ The Vulnerable Scenario (String Concatenation)
If our backend combined the title field from the mobile app's quick-note form using direct string linkers (`+` or template literals), the code would look like this:

```typescript
// HIGHLY VULNERABLE CODE (DO NOT USE)
const userInput = req.body.title; 
const queryText = "SELECT * FROM notes WHERE title = '" + userInput + "'";
```

### 🎯 The Attack Vector Example
A malicious actor could input the following payload into the title text input of the mobile form:
`'; DROP TABLE notes;--`

When the server processes the request, the query string collapses into a destructive execution block:
```sql
SELECT * FROM notes WHERE title = ''; DROP TABLE notes;--'
```

#### How the database breaks:
1. `'` closes the intended literal string early.
2. `;` terminates the first `SELECT` statement cleanly.
3. **`DROP TABLE notes;`** injects a fresh, high-privilege structural command that deletes our entire notes repository instantly.
4. `--` turns the remaining trailing single quote into an inofensive database comment, preventing SQL syntax crashes.

---

## 2. How Parameterized Queries Prevent Injection

**Parameterized Queries** (also known as Prepared Statements) completely eliminate SQL injection vectors by separating the query structure from the actual variable data.

### 🛡️ The Secure Implementation (Our Engine)
In **Page & Frame**, our unified database gateway (`backend/lib/db.ts`) forwards parameters to Neon by isolating the code from the literals:

```typescript
// IMMUNE CODE (Parameterized Approach)
const queryText = "SELECT * FROM notes WHERE title = \$1";
await sql.query(queryText, [userInput]);
```

### 🧠 How It Works Under the Hood
1. **Compilation Phase:** The Next.js API sends the command structure (`SELECT ... WHERE title = \$1`) to the PostgreSQL engine in the cloud first. Neon pre-compiles this execution plan, locking its logical tree so no new keywords (`DROP`, `UNION`, `OR`) can be introduced.
2. **Execution Phase:** The isolated array containing the user data (`['; DROP TABLE notes;--']`) is sent over a secondary parameter highway.
3. **Neutralization:** The database engine treats the payload **strictly as a plain text string literal** matching the column type. The system is 100% safe because the malicious script gets stored safely in the database cell as a literal string title, instead of running as code.

---

## 3. Environment Variables and Secret Protection

A **Connection String** is a powerful URI block (`postgresql://owner:password@cluster.neon.tech/db`) that provides absolute administrative entry to the database engine. If these credentials fall into the wrong hands, attackers could extract, corrupt, or erase the entire system.

### ❌ Why Hardcoding Credentials is Fatal
Embedding the connection string inside production code files (like `db.ts`) is a massive security hazard. Since version control systems like **GitHub** keep public histories of every text line, anyone browsing the repository can instantly harvest the password. Even inside mobile app binaries, compiled strings can be unpacked via basic reverse-engineering (`.apk` or `.ipa` decompilation) in minutes.

### 🛡️ Secure Solution: The `.env.local` Architecture
To mitigate this risk, **Page & Frame** implements a strict server-side Environment Variable strategy using Next.js native `.env.local` layers:

1. **Local Isolation:** The secret URI key is assigned locally to the environment process inside `backend/.env.local`:
   ```text
   DATABASE_URL=postgresql://neondb_owner:PASSWORD@ep-gentle-cake.neon.tech/neondb
   ```
2. **Git Shielding:** The global and backend `.gitignore` rules actively block this file from being indexed or tracked by Git. It remains safely locked in the developer's machine and production cloud containers.
3. **Public Template:** A generic `backend/.env.example` file is pushed to GitHub with blank fields, acting as an implementation guide for evaluators without exposing real passwords:
   ```text
   DATABASE_URL=
   ```
