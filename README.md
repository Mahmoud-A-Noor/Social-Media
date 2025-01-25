# MERN Stack Social Media App

A feature-rich social media application built with the MERN stack. It provides a seamless social networking experience, allowing users to interact through posts, stories, likes, comments, and sharing. The app also includes secure authentication, real time notification, integrated chat feature, Live Stream, and cloud storage integration for rich media sharing.

---

## Key Features

- **Authentication**: Secure email/password login and Google OAuth integration.
- **Social Interaction**: Users can create posts, stories, and engage with likes, comments, and sharing.
- **Real-Time Notifications**: Instantly receive updates for interactions, messages, and events to stay engaged.
- **Rich Media Support**: Share images, videos, PDF documents, and other files with cloud storage integration for reliable and secure storage.
- **Integrated Real-Time Chat**: Communicate with friends and groups instantly through real-time messaging.
- **Live Video Feature**: Host and participate in live video sessions for real-time interactions.
---

## Technologies Used

### Frontend
- **React.js**: Component-based UI development.
- **Tailwind CSS**: Utility-first styling framework.
- **Axios**: Simplified HTTP requests.

### Backend
- **Express.js**: Fast and minimalist web framework.
- **MongoDB**: NoSQL database for scalable data storage.
- **Socket.io**: Real-time communication for messaging and notifications.
- **bcrypt**: Secure password hashing.
- **JWT**: Token-based authentication.
- **passport**: Google OAuth implementation.
- **multer**: File upload handling.
- **cloudinary**: Cloud-based media storage and management.
- **express-validator**: Input validation for enhanced security.

---

## Project Structure

```
mern-social-media-app/
├── backend/            # Express.js backend
├── frontend/             # React.js frontend
├── package.json       # Project metadata
└── README.md          # Project documentation
```

---
## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mern-social-media-app.git
   cd mern-social-media-app
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend
   npm install
   ```

3. Create a `.env` file in the frontend & backend directory and configure the following variables:<br /><br />
   frontend `.env`
   ```frontend env
    VITE_API_BASE_URL=http://localhost:3000
   ```
   backend `.env`
   ```backend env
    MONGO_URI=<your_mogodb_url>
    JWT_SECRET=<your_jwt_secret>
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>
    CLIENT_URL=http://localhost:5173
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   ```

5. Start the development server:
   ```bash
   # Start backend
   cd frontend
   nodemon server.js

   # Start frontend
   cd frontend
   npm start
   ```

6. Open your browser and visit `http://localhost:3000`.

---

## Screenshots
![home](https://github.com/user-attachments/assets/eb89aa98-b1f5-4ae1-acf9-b5270f71ba49)

### Login & Register Pages
![login](https://github.com/user-attachments/assets/27b3b739-f426-4a2e-b278-9efabe1212e1)
![register](https://github.com/user-attachments/assets/b27e6675-7a40-44b9-84f6-29d53d36a7f1)

### User Profile
![profile](https://github.com/user-attachments/assets/b2d307db-8312-4cdd-b099-07774e968e9d)

### Post Creation
![create post](https://github.com/user-attachments/assets/c752d966-246c-4312-869b-248a0debcf75)

### Real-time Messaging
![chat](https://github.com/user-attachments/assets/ef22fd13-65cf-40c1-8026-43160deb0df9)

### Real-time Notifications
![notifications](https://github.com/user-attachments/assets/a11cdad8-9371-45b9-a3b4-1684156f4332)

---

## Contributing

Contributions are welcome! Please create an issue or submit a pull request with your changes.

---

## Contact

For questions or feedback, please reach out to [mahmoudnoor917@gmail.com](mailto:mahmoudnoor917@gmail.com).

