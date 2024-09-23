
# Course Management System (Practice)

This is a **Node.js** practice project built with **Express.js**, **TypeScript**, and **Mongoose**. It simulates a course management system, allowing for user and admin authentication, as well as CRUD operations for managing users and courses.

## Features

- **User Authentication** using JSON Web Tokens (JWT)
- **Admin Authorization** for managing courses and users
- CRUD operations for:
  - Users
  - Courses

## Technologies

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type safety and tooling
- **Mongoose**: MongoDB object modeling
- **JWT**: Token-based authentication

## Directory Structure
```
src/
├── index.ts              # Main entry point
├── middlewares/          # Authentication and authorization middleware
│   ├── user.ts           # User authentication middleware
│   └── admin.ts          # Admin authentication middleware
├── routes/               # API route handlers
│   ├── user/             
│   │   └── user.ts       # Routes for user management
│   └── course/           
│       └── course.ts     # Routes for course management
├── db/                   # Database models and connection
│   └── db.ts             # Mongoose configuration
└── schema/               # Schema definitions for MongoDB
    └── schema.ts
```

## Endpoints

- **User Management**:
  
  - ```POST /user``` – Create a user  
  - ```GET /user``` – Get user data  
  - ```PUT /user/:id``` – Update a user  
  - ```DELETE /user/:id``` – Delete a user

- **Course Management**:
  
  - ```POST /course``` – Add a course  
  - ```GET /course``` – View all courses  
  - ```PUT /course/:id``` – Update a course  
  - ```DELETE /course/:id``` – Delete a course
  

- **Admin Actions**:  
  - Admin-specific actions related to user and course management

## Getting Started

1. Clone the repository:

   ``` bash
   git clone https://github.com/your-username/practice-course-management.git
   cd practice-course-management
   ```

2. Install dependencies:

  ```bash
   npm install
  ```

3. Set up environment variables (e.g., JWT secret, MongoDB connection string).

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Use tools like **Postman** or **cURL** to interact with the API.

---

This README can be expanded with more information as needed. It's intended for practice purposes only.
