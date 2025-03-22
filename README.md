# Social Posts Analytics Platform

A full-stack application for analyzing and displaying social media posts with various analytics features.

## Features

### 1. User Posts
- Fetch posts for specific users
- Input validation for user IDs
- Error handling for API responses

### 2. Popular Posts
- Identifies posts with the highest comment counts
- Aggregates comment data across all posts
- Provides detailed post information including comment counts

### 3. Latest Posts
- Displays the 5 most recent posts
- Sorted by creation timestamp
- Real-time updates

### 4. User Analytics
- Ranks top 5 users based on post count
- Provides user details including:
  - User ID
  - Username
  - Total post count

## Tech Stack

### Frontend
- React.js
- Tailwind CSS for styling
- Vite for build tooling and development
- Axios for API requests

### Backend
- Node.js
- Express.js
- Environment configuration with dotenv
- CORS support for cross-origin requests
- Authentication system with token management

## Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

4. Configure Environment Variables
Create a `.env` file in the backend directory with the following variables:
```env
USERS_URL=<your-users-api-url>
POSTS_URL=<your-posts-api-url>
COMMENTS_URL=<your-comments-api-url>
```

### Running the Application

1. Start the Backend Server
```bash
cd backend
npm run dev
```

2. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```

## API Endpoints

### Users
- `GET /users/` - Get top 5 users based on post count

Sample Response:
![Top 5 Users](images/Top%205%20Users.png)

### Posts
- `GET /posts/:userId` - Get posts for a specific user
- `GET /topposts/top?type=popular` - Get most commented posts
  
  Sample Response:
  ![Get Popular Posts](images/Get%20Popular%20Posts.png)
  
- `GET /topposts/top?type=latest` - Get 5 most recent posts
  
  Sample Response:
  ![Get Latest Posts](images/Get%20Latest%20Posts.png)

## Error Handling

The application includes comprehensive error handling for:
- Invalid user IDs
- API timeouts
- Missing environment variables
- Invalid API responses
- Network errors

## Dependencies

### Backend
- express: ^4.21.2
- axios: ^1.8.4
- cors: ^2.8.5
- dotenv: ^16.4.7
- nodemon: ^3.1.9 (development)

### Frontend
- react: ^19.0.0
- react-dom: ^19.0.0
- axios: ^1.8.4
- tailwindcss: ^4.0.15
- vite: ^6.2.0

## License
ISC
