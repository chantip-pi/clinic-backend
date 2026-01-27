# Clinic Backend

Node.js + Express API that connects to a cloud-hosted PostgreSQL instance (e.g. Render, Neon, Supabase, Railway). It exposes separate modules for **staff**, **patients** and **appointments**, matching the frontend interfaces.

## Project Structure
```
clinic-backend
├── config/
│   └── database.js      # Pool + connection helper
├── controllers/         # Request handlers (staff, patient, appointment)
├── middleware/          # Logger + error handler
├── models/              # Database queries (per entity)
├── routes/              # API routes (per entity, mounted under /api)
├── server.js            # App bootstrap
└── package.json
```

At a high level:
- **models**: talk to PostgreSQL and map rows into JS objects that match your frontend types.
- **controllers**: contain the request/response logic, call models, and shape API responses.
- **routes**: define URL paths and HTTP verbs, and connect them to controllers.
- **server.js**: wires middleware, mounts `/api` routes, and starts the HTTP server after DB check.

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
       title TEXT NOT NULL,
       created_at TIMESTAMPTZ DEFAULT NOW(),
       updated_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```

   - Create a `patients` table:

     ```sql
     CREATE TABLE patients (
       patient_id SERIAL PRIMARY KEY,
       name_surname TEXT NOT NULL,
       phone_number TEXT,
       birthday DATE,
       gender TEXT,
       remaing_course INTEGER DEFAULT 0,
     );
     ```

   - Create an `appointments` table:

     ```sql
     CREATE TABLE appointments (
       appointment_id SERIAL PRIMARY KEY,
       patient_id INTEGER NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
       appointment_date_time TIMESTAMPTZ NOT NULL,
       status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
       reason TEXT,
       created_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```

4. **Run the API**
   ```bash
   npm start
   ```
   The server will first verify the database connection before listening on `PORT`.

## Available Routes
- `GET /health` – simple readiness probe.
### Staff
- `GET /api/staff` – list staff members.
- `GET /api/staff/id/:staffId` – fetch one staff member by id.
- `GET /api/staff/username/:username` – fetch one staff member by username.
- `GET /api/staff/login/:username/:password` – simple login look-up.
- `POST /api/staff` – create staff.
- `PUT /api/staff/:staffId` – update staff.
- `DELETE /api/staff/:staffId` – remove staff.

### Patients
- `GET /api/patients` – list patients.
- `GET /api/patients/:patientId` – fetch one patient by id.
- `GET /api/patients/appointment/:appointmentDate` – list patients by appointment date.
- `POST /api/patients` – create patient.
- `PUT /api/patients/:patientId` – update patient.
- `DELETE /api/patients/:patientId` – remove patient.

### Appointments
- `GET /api/appointments` – list all appointments.
- `GET /api/appointments/:appointmentId` – fetch one appointment by id.
- `GET /api/appointments/patient/:patientId` – list appointments for a given patient.
- `POST /api/appointments` – create appointment.
- `PUT /api/appointments/:appointmentId` – update appointment.
- `DELETE /api/appointments/:appointmentId` – remove appointment.

## How to add a new entity (example: Appointment)

When you add a new entity, you typically follow this order:

1. **Design the DB table**  
   - Decide the columns and types (e.g. `appointments` with `appointment_id`, `patient_id`, `appointment_date_time`, `status`, `reason`, `created_at`).  
   - Create the table with a migration or raw SQL (see examples above).

2. **Create the model (e.g. `models/appointment.js`)**  
   - Import `pool` from `config/database.js`.  
   - Write query functions like `getAppointments`, `getAppointmentById`, `createAppointment`, `updateAppointment`, `cancelAppointment`.  
   - Map DB rows into plain JS objects that match your frontend interface (`Appointment` in this case).

3. **Create the controller (e.g. `controllers/appointment.js`)**  
   - Import the model functions.  
   - Implement request handlers that:
     - Call model functions.
     - Handle errors (500) and not-found cases (404).
     - Send JSON responses back to the client.

4. **Create the routes (e.g. `routes/appointment.js`)**  
   - Create an Express router.  
   - Define HTTP endpoints (`GET /appointments`, `POST /appointments`, etc.) and attach the controller handlers.

5. **Mount routes under `/api` (e.g. in `routes/staff.js`)**  
   - Import the new router and mount it with `router.use('/', appointmentRoutes);`.  
   - Because `server.js` uses `app.use('/api', routes);`, your appointment endpoints will be available under `/api/appointments`.

6. **Use from the frontend**  
   - Point your frontend `fetch`/Axios calls at the new `/api/...` endpoints.  
   - The JSON returned will match your TypeScript interfaces (`Staff`, `Patient`, `Appointment`).

Use Postman/curl or plug this backend into your clinic frontend.

## Deployment Tips
- Set the same `DATABASE_URL` and `PORT` env vars on your hosting provider.
- Ensure outbound networking to your Postgres provider is allowed.
- If your provider enforces SSL, keep the default `PGSSLMODE` (do **not** disable SSL).

## License
ISC