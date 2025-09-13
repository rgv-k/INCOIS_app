# Ocean Hazard Reporting Platform

An integrated platform for crowdsourced ocean hazard reporting and social media analytics developed for the SIH Hackathon.

## Overview

This platform enables citizens, coastal residents, volunteers, and disaster managers to report observations during hazardous ocean events and monitors public communication trends via social media.

## Features Implemented

- **Server Infrastructure**: Express.js backend with MongoDB database connection
- **API Routes**: Endpoints for report submission and retrieval
- **Data Models**: Structured schemas for reports and users
- **Image Upload**: File storage middleware for photos submitted by users
- **Authentication**: JWT-based user authentication system

## Project Structure

```bash
ocean-hazard-platform/
├── server/               # Backend server
│   ├── controllers/      # Business logic
│   │   ├── reportController.js
│   │   └── userController.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # Authentication middleware
│   │   └── upload.js     # File upload middleware
│   ├── models/           # Database models
│   │   ├── Report.js     # Report schema
│   │   └── User.js       # User schema
│   ├── routes/           # API routes
│   │   ├── reportRoutes.js
│   │   └── userRoutes.js
│   └── server.js         # Entry point
└── .gitignore            # Git ignore file
```

## API Endpoints

### Reports

- `GET /api/reports`: Get all reports
- `GET /api/reports/:id`: Get a specific report
- `POST /api/reports`: Create a new report
- `PUT /api/reports/:id`: Update a report
- `DELETE /api/reports/:id`: Delete a report

### Users

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Log in a user
- `GET /api/users/profile`: Get user profile (requires authentication)

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Multer for local storage

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   cd server
   npm install
   ```

3. Create a `.env` file in the server directory with:

   ```bash
   MONGODB_URI=mongodb://localhost:27017/ocean-hazard-platform
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

4. Start the server:

   ```bash
   npm start
   ```

## Upcoming Features

- Web dashboard for data visualization
- Mobile app for citizen reporting
- Social media analytics integration
- Dynamic hotspot generation
