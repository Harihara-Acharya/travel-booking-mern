# Travel Booking MERN Application

This is a full-stack Travel Booking application built using the MERN stack.
The project allows users to browse travel packages, book trips, and manage bookings.

---

## Tech Stack

Frontend:
- React
- Axios
- CSS

Backend:
- Node.js
- Express
- MongoDB
- JWT Authentication

---

## Project Structure

travel-booking-mern
├── frontend
├── backend
└── README.md

---

## Prerequisites

Make sure the following are installed on your system:

- Node.js (v16 or above)
- npm
- MongoDB (local or Atlas)
- Git

---

## How to Run the Project Locally

### Step 1: Clone the Repository

git clone https://github.com/Harihara-Acharya/travel-booking-mern.git
cd travel-booking-mern

---

### Step 2: Backend Setup

cd backend
npm install

Create a `.env` file inside the backend folder and add:

PORT=5050  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

Start the backend server:

npm run dev  
or  
node server.js  

Backend will run on:
http://localhost:5050

---

### Step 3: (Optional) Seed Sample Data

To insert sample travel packages into the database:

node seedPackages.js

---

### Step 4: Frontend Setup

Open a new terminal window:

cd frontend
npm install
npm start

Frontend will run on:
http://localhost:3000

---

## Application Flow

1. Register a new user
2. Login
3. View travel packages
4. View package details
5. Book a package
6. View bookings in "My Bookings"

---

## Contribution Guidelines

- Do not push directly to the main branch
- Create a new branch for each feature

Example:

git checkout -b feature-new-feature
git add .
git commit -m "Add new feature"
git push origin feature-new-feature

Create a Pull Request on GitHub after pushing.

---

## Notes

- node_modules is ignored using .gitignore
- .env file is not included in the repository
- MongoDB must be running before starting the backend

---

Maintained by Harihara Acharya
GitHub: https://github.com/Harihara-Acharya
