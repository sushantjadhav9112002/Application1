# Rule Engine Application

This is a 3-tier rule engine application built using the MERN stack. It allows you to create, combine, and evaluate dynamic rules for determining user eligibility based on various attributes such as age, department, income, and spend. The rules are represented as an Abstract Syntax Tree (AST) and can be modified dynamically.

## Features
- **Create Rule**: Define new rules using simple conditional logic.
- **Combine Rules**: Combine multiple rules into a single AST for efficient evaluation.
- **Evaluate Rules**: Use JSON data to evaluate whether a user meets the eligibility criteria defined by the rules.
- **Dynamic Rule Modification**: Modify existing rules and sub-expressions in the AST.

## Tech Stack
- **Frontend**: React (Latest version)
- **Backend**: Node.js (v20) with Express
- **Database**: MongoDB (Atlas)
- **ORM**: Mongoose
- **State Management**: React Hooks
- **API Testing**: Postman or similar tools

## Project Setup

### Prerequisites
- **Node.js** (v20.x.x)
- **MongoDB Atlas** (or local MongoDB instance)
- **npm** or **yarn**

  ### 1. Clone the Repository
    ```bash
    git clone https://github.com/yourusername/rule-engine-app.git
    cd rule-engine-app
 ### 2. Install Dependencies
      **Backend (Node.js and Express)**
       ```bash
         cd backend
         npm install
       ```
      **Frontend (React)**
       ```bash
        cd frontend
        npm install
       ```
      **Frontend (React)**
       ```bash
        cd frontend
        npm install
       ```
 ### 3. MongoDB Setup
   **Go to MongoDB Atlas, set up a new cluster, and whitelist your IP address.**
   **Get your connection string and replace the MongoDB URI in the backend/.env file:**
   ```php
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
### 4. Run the Application
   **Backend**
   ```bash
   cd backend
   nodemon server.js
   ```
   **Frontend**
   ```bash
   cd frontend
   npm start
   ```
 ### 5. Folder Structure
  ```bash
  rule-engine-app/
├── backend/                # Backend (Node.js, Express)
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routes
│   └── server.js           # Main backend server
├── frontend/               # Frontend (React)
│   ├── public/             # Public assets
│   ├── src/                # Source files
│   └── App.js              # Main React App
├── .gitignore              # Git ignore file
└── README.md               # Project README file
```
   
