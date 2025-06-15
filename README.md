# Task Manager Application

A full-stack task management system with user authentication, role-based access control, and reporting features.

## Features

- **User Authentication**
  - Registration with email/password
  - Login/logout functionality
  - Profile management
  - Role-based access (Admin/Member)

- **Task Management**
  - Create, read, update, and delete tasks
  - Assign tasks to team members
  - Task prioritization (Low/Medium/High)
  - Status tracking (Pending/In Progress/Completed)
  - Todo checklists with progress tracking
  - File attachments

- **Dashboard & Reporting**
  - Visual charts for task distribution
  - Status summary widgets
  - Export tasks/users to Excel
  - Recent tasks overview

- **Team Management** (Admin only)
  - View all team members
  - Task assignment statistics
  - Admin user creation

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- ExcelJS (for reporting)

### Frontend
- React.js
- React Router
- Tailwind CSS
- Recharts
- Axios
- React Icons

## Project Structure
task-manager/
├── BackEnd/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── reportController.js
│ │ ├── taskController.js
│ │ └── userController.js
│ ├── middlewares/
│ │ ├── authMiddleware.js
│ │ └── uploadMiddleware.js
│ ├── models/
│ │ ├── Task.js
│ │ └── User.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── reportRoutes.js
│ │ ├── taskRoutes.js
│ │ └── userRoutes.js
│ └── server.js
├── FrontEnd/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── context/
│ │ ├── hooks/
│ │ ├── pages/
│ │ ├── routes/
│ │ ├── utils/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── index.css
│ ├── package.json
│ └── vite.config.js
├── .env
└── README.md

text

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager
Install backend dependencies

bash
cd BackEnd
npm install
Install frontend dependencies

bash
cd ../FrontEnd
npm install
Set up environment variables

Create a .env file in the root directory based on the provided .env.example

Start the application

In one terminal (backend):

bash
cd BackEnd
npm start
In another terminal (frontend):

bash
cd FrontEnd
npm run dev
API Endpoints
Authentication
POST /api/auth/register - Register a new user

POST /api/auth/login - User login

GET /api/auth/profile - Get user profile

PUT /api/auth/profile - Update profile

Tasks
GET /api/tasks - Get all tasks

POST /api/tasks - Create a new task

GET /api/tasks/:id - Get task by ID

PUT /api/tasks/:id - Update task

DELETE /api/tasks/:id - Delete task

Users (Admin only)
GET /api/users - Get all users

GET /api/users/:id - Get user by ID

Reports (Admin only)
GET /api/reports/export/tasks - Export tasks to Excel

GET /api/reports/export/users - Export user-task report

Available Scripts
In the project directory, you can run:

Frontend
npm run dev - Runs the app in development mode

npm run build - Builds the app for production

npm run preview - Previews the production build

Backend
npm start - Starts the Node.js server

Configuration
Ensure you have the following environment variables set:

env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_INVITE_TOKEN=your_admin_invite_token
PORT=8000
CLIENT_URL=http://localhost:5173
Screenshots
(You can add screenshots of your application here)

License
This project is licensed under the MIT License.

Contributing
Contributions are welcome! Please open an issue or submit a pull request.

Contact
For questions or support, please contact [your email].

text

This README provides a comprehensive overview of your project, including:
1. Key features
2. Technology stack
3. Project structure
4. Installation instructions
5. API documentation
6. Configuration details
7. Usage instructions
