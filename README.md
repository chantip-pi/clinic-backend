# Clinic Backend

Node.js + Express API that connects to a cloud-hosted PostgreSQL instance (e.g. Render, Neon, Supabase, Railway). It exposes a `/api/staff` resource whose shape matches the frontend `Staff` interface.

## Project Structure
```
clinic-backend
├── config/
│   └── database.js      # Pool + connection helper
├── controllers/         # Request handlers
├── middleware/          # Logger + error handler
├── models/              # Database queries
├── routes/              # API routes
├── server.js            # App bootstrap
└── package.json
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a `.env` file**
   ```bash
   PORT=3000
   DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
   # PGSSLMODE=disable   # only if your provider does not require SSL
   ```
   - Most hosted Postgres providers expose a connection string in their dashboard—copy it into `DATABASE_URL`.
   - Leave SSL enabled for cloud environments. Local dockerized databases can opt out via `PGSSLMODE=disable`.

3. **Provision the Cloud Database**
   - Create a `staff` table (minimal example):
     ```sql
     CREATE TABLE staff (
       staff_id SERIAL PRIMARY KEY,
       username TEXT NOT NULL UNIQUE,
       password TEXT NOT NULL,
       name_surname TEXT NOT NULL,
       phone_number TEXT,
       birthday DATE,
       gender TEXT,
       email TEXT UNIQUE,
       role TEXT NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```

4. **Run the API**
   ```bash
   npm start
   ```
   The server will first verify the database connection before listening on `PORT`.

## Available Routes
- `GET /health` – simple readiness probe.
- `GET /api/staff` – list staff members.
- `GET /api/staff/:staffId` – fetch one staff member by id.
- `GET /api/staff/:username` – fetch one staff member by username.
- `POST /api/staff` – create staff.
- `PUT /api/staff/:staffId` – update staff.
- `DELETE /api/staff/:staffId` – remove staff.

Use Postman/curl or plug this backend into your clinic frontend.

## Deployment Tips
- Set the same `DATABASE_URL` and `PORT` env vars on your hosting provider.
- Ensure outbound networking to your Postgres provider is allowed.
- If your provider enforces SSL, keep the default `PGSSLMODE` (do **not** disable SSL).

## License
ISC