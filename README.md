# CodeSharing Platform

## Overview
The **CodeSharing Platform** is a collaborative web application designed for developers, teams, and organizations to:
- Share and manage code snippets.
- Organize and manage teams.
- Schedule meetings.
- Facilitate seamless communication.

This platform empowers users with a user-friendly interface and robust backend APIs to streamline collaboration, ensuring data security and efficient project management.

---

## Features

### Core Features
1. **Authentication**
   - User registration and login.
   - Secure authentication using JWT.
2. **Team Management**
   - Create, update, delete, and manage teams.
   - Role-based access control (e.g., admin privileges).
3. **Code Management**
   - CRUD operations for code snippets.
   - Search and filter snippets by language, tags, or titles.
4. **Messaging**
   - Send and retrieve messages within teams or between users.
5. **Meeting Scheduling**
   - Schedule and manage meetings for teams.
6. **Search and Filter**
   - Comprehensive search functionality for code snippets.

### Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT for secure session management

### Models
- **User Model**: Handles user information and authentication.
- **Team Model**: Manages team details and membership.
- **Code Model**: Stores code snippets and metadata.
- **Message Model**: Tracks messaging history within the platform.
- **Meeting Model**: Organizes scheduled meetings.

---

## API Endpoints

### Authentication
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Authenticate and log in a user.
- `GET /auth/logout`: Log out the current user.
- `GET /auth/profile`: Retrieve user profile details.

### Team Management
- `POST /teams`: Create a new team.
- `GET /teams`: Fetch all teams for a user.
- `GET /teams/:id`: Retrieve details of a specific team.
- `PUT /teams/:id`: Update team details.
- `DELETE /teams/:id`: Delete a team.

### Code Management
- `POST /codes`: Create a new code snippet.
- `GET /codes`: Retrieve all code snippets for a user or team.
- `GET /codes/:id`: Get details of a specific code snippet.
- `PUT /codes/:id`: Update a code snippet.
- `DELETE /codes/:id`: Delete a code snippet.

### Messaging
- `POST /messages`: Send a message to a user or team.
- `GET /messages/team/:id`: Retrieve all messages for a team.
- `GET /messages/user/:id`: Retrieve messages with a user.

### Meetings
- `POST /meetings`: Schedule a new meeting.
- `GET /meetings/team/:id`: Retrieve all meetings for a team.
- `DELETE /meetings/:id`: Cancel a meeting.

---

## Project Structure

### Backend
- **Config**: Database and default configuration.
- **Controllers**: Logic for authentication, user management, code handling, and more.
- **Middleware**: Authentication and error handling.
- **Models**: User, Team, Code, Message, Meeting models.
- **Routes**: Organized endpoints for each feature.
- **Utils**: Logger and email services.

### Frontend
- **Components**: Reusable components for various functionalities (auth, dashboard, etc.).
- **Pages**: Organized pages for navigation.
- **Context**: State management and context APIs.
- **Hooks**: Custom hooks for fetching data and authentication.
- **Services**: API services for communication with the backend.

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zeeshan-Afzal-01/CodeSharingPlatform.git
   cd code-sharing-platform
   ```

2. **Install dependencies**
   - For Backend:
     ```bash
     cd backend
     npm install
     ```
   - For Frontend:
     ```bash
     cd frontend
     npm install
     ```

3. **Run the application**
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend:
     ```bash
     cd frontend
     npm run dev
     ```

4. **Environment Variables**
   - Configure `.env` files for the backend (e.g., database connection, JWT secret).

---

## Contribution

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch for your feature.
3. Submit a pull request.

---


## Contact
For inquiries or collaboration, contact:
- [Zeeshan Afzal](mailto:zna152191@gmail.com)
