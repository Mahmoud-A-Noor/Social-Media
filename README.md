# MERN Stack Social Media App

A feature-rich social media application built with the MERN stack. It provides a seamless social networking experience, allowing users to interact through posts, stories, likes, comments, and sharing. The app also includes secure authentication, real time notification, integrated chat feature, and cloud storage integration for rich media sharing.

---

## Key Features

- **Authentication**: Secure email/password login and Google OAuth integration.
- **Social Interaction**: Users can create posts, stories, and engage with likes, comments, and sharing.
- **Real-time Notifications**: Receive updates instantly for interactions and events.
- **Rich Media Support**: Share images, videos, and documents with cloud storage integration.

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

3. Create a `.env` file in the frontend & backend directory and configure the following variables:
   ```frontend env
    VITE_API_BASE_URL=http://localhost:3000
   ```
   ```backend env
    MONGO_URI=<your_mogodb_url>
    JWT_SECRET=<your_jwt_secret>
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>
    NODE_ENV=Development
    CLIENT_URL=http://localhost:5173
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   ```

4. Start the development server:
   ```bash
   # Start backend
   npm run dev

   # Start frontend
   cd frontend
   npm start
   ```

5. Open your browser and visit `http://localhost:3000`.

---

## Screenshots

### Authentication Page
![Authentication Page](https://dummyimage.com/600x400/000/fff&text=Authentication+Page)

### User Dashboard
![User Dashboard](https://dummyimage.com/600x400/000/fff&text=User+Dashboard)

### Post Creation
![Post Creation](https://dummyimage.com/600x400/000/fff&text=Post+Creation)

### Real-time Messaging
![Messaging](https://dummyimage.com/600x400/000/fff&text=Messaging)

### Notifications
![Notifications](https://dummyimage.com/600x400/000/fff&text=Notifications)

---

## Folder Structure

```
mern-social-media-app/
├── backend/            # Express.js backend
├── frontend/             # React.js frontend
├── .env               # Environment variables
├── package.json       # Project metadata
├── README.md          # Project documentation
```

---

## Contributing

Contributions are welcome! Please create an issue or submit a pull request with your changes.

---

## Contact

For questions or feedback, please reach out to [mahmoudnoor917@gmail.com](mailto:mahmoudnoor917@gmail.com).

