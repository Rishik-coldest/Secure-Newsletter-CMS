# Secure Newsletter CMS

A full-stack, secure Content Management System (CMS) designed for managing and publishing newsletters. Built as part of the Advanced Web Development assignment at the University of East Anglia.

## 🛠️ Setup Instructions

Follow these steps to set up and run the application locally on your machine.
 

### 2. Install Dependencies


npm install


### 3. Environment Configuration


Create a `.env` file in the root directory and copy the contents from `.env.example`:

Open the `.env` file and populate it with your local credentials (database connection strings and Google OAuth secrets).

 
### 4. Database Initialization & Sync


Run Prisma migrations to set up your PostgreSQL database schema:

npx prisma db push


### 6. Run the Development Server


npm run dev

The application will be accessible locally at `http://localhost:3000`.

 
## 🔐 Authentication Approach


This project implements a secure session management using **Auth.js**:

* **Google OAuth Provider:** Partially implemented verified authentication handling via external Google accounts.

* **Credentials Provider:** Fallback authentication using secure local email/password records.

* **Route Guarding:** Next.js Middleware strictly protects all endpoint structures under `/dashboard` and its sub-routes. Unauthenticated visitors are automatically bounced away from private access fields.

* **Secure Sessions:** Solid state management handling that hides or exposes navigation elements (`/login`, `/register`, `/dashboard`) dynamically based on context.
 

## 👥 Test Credentials 


  * **Email:** `harry@kane.com`

  * **Password:** `ballondor`