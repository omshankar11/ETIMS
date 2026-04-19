# ETIMS - Electronic Tax Invoice Management System

A full-stack web application for managing tax invoices, businesses, and generating reports.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Features
- **User Roles**: Admin, Business Owner, Accountant
- **Business Management**: Register/Update businesses
- **Invoice Management**: Create, view, and auto-submit invoices to Mock ETIMS API.
- **Dashboard**: Real-time stats and charts.
- **Security**: JWT Auth, Hashed passwords.

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB

### Installation

1.  **Clone the repository**
2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Update .env with your MONGO_URI
    npm run dev
    ```
3.  **Client Setup**
    ```bash
    cd client
    npm install
    npm run dev
    ```

## Usage
1.  Register a new account (Business Owner).
2.  Login.
3.  Go to "Businesses" to register your business details.
4.  Go to "Invoices" to create tax invoices.
5.  View "Dashboard" for insights.
