# User Management Web App
A full-stack user management application with CRUD operations, Excel upload, and validations.

# Tech Stack

- Frontend: React, TypeScript, Bootstrap
- Backend: Node.js, Express, TypeScript
- Database: MySQL

# Setup Instructions

1. Clone the Repository
git clone https://github.com/kanishkaas/user-management-app.git
cd user-management-app

2. MySQL Setup
Open MySQL.

Create a new database, e.g., user_management_db.

Run the schema script to create the users table:

-- Inside MySQL client or phpMyAdmin
source db/schema.sql;
Or manually execute the contents of db/schema.sql.

3. Backend Setup
cd backend
npm install
Update DB config in src/config/db.ts with your local MySQL credentials.

const pool = createPool({
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'user_management_db',
  connectionLimit: 10
});
Then run:

npm run dev
Backend will run at: http://localhost:5000

4. Frontend Setup
cd ../frontend
npm install
npm start
Frontend will run at: http://localhost:3000

# Sample Excel Template
Downloadable from the UI, or use the one provided here:
sample-template.xlsx

First Name	Last Name	Email	Phone Number	PAN Number
John	Doe	john@example.com	9876543210	ABCDE1234F

# Assumptions & Known Issues
1. Email must be unique — duplicate entries will result in DB errors.

2. PAN is masked by default in the UI, toggleable via eye icon.

3. Excel upload will not accept partial rows; if any row is invalid, the entire upload is rejected.

4. UI is responsive but optimized for desktop first.

5. No authentication implemented.

# Author
Kanishka Sharma

# Folder Structure
user-management-app/
├── backend/             
├── frontend/              
├── db/schema.sql          
├── sample-template.xlsx  
└── README.md


