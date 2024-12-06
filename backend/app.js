const express = require('express');
const passport = require('./config/passport');

const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const socialRoutes = require("./routes/socialRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const fileRoutes = require("./routes/fileRoutes");

const cors = require('cors');

const app = express();


app.use(express.json());
app.use(passport.initialize());

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from the frontend (React app)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // You can add any specific headers you need
}));


app.use((req, res, next) => {
    if (!req.path.startsWith('/auth') && !req.path.startsWith('/file/video')) {
      return authMiddleware(req, res, next);
    }
    next();
});

app.use('/auth', authRoutes);
app.use('/social', socialRoutes);
app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/notifications', notificationRoutes);
app.use('/file', fileRoutes);



app.use(errorHandler);

module.exports = app;