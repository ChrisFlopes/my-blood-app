# My Blood App

A web application for managing blood work requests, patients, and doctors.

## Features
- User authentication (login, register, refresh tokens)
- Role-based access (doctor, patient, lab technician, admin)
- Manage blood work requests and approvals
- Export and import CSV data

## Installation

### Prerequisites
- [Ruby](https://www.ruby-lang.org/en/) (version 3.0 or higher)
- [Rails](https://rubyonrails.org/) (version 7.0 or higher)
- [Node.js](https://nodejs.org/) (version 16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (or your preferred database)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   bundle install
   ```
3. Set up the database:
   ```bash
    rails db:create db:migrate db:seed
   ```
4. Start the Rails server:
   ```bash
   rails server
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

### Accessing the Application
   You can access the application at: http://localhost:3001