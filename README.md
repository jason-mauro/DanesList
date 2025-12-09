# Danes List

This guide will help you set up and run the application after cloning the repository. The project consists of a React Frontend and Express backend
## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js 18+ and npm** - [Download here](https://nodejs.org/)

Verify installations by running:
```bash
node -version
npm -version
```

## Project Structure

```
project-root/
├── backend/          # Express Backend
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/         # React + Vite application
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Backend Setup (Spring Boot)

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies and build the project:

```bash
npm install
```

Run the Spring Boot application:

```bash
npm run dev
```

The backend server will start on **http://localhost:7002** or specified port in your .env


### 3. Frontend Setup (React + Vite)

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will start on **http://localhost:5173** (default Vite port).

## Running Both Applications

You need to run both the backend and frontend simultaneously in separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## IMPORTANT NOTE
You need to have a connection to a MongoDB database in order to work with any data. Also, there are some environment variables to set which are not. Please reach out if you want to run the application.

