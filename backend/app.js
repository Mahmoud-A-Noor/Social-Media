const express = require('express');
const passport = require('./config/passport');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const socialRoutes = require("./routes/socialRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();


app.use(express.json());
app.use(passport.initialize());

app.use((req, res, next) => {
    if (!req.path.startsWith('/auth')) {
      return authMiddleware(req, res, next);
    }
    next();
});

app.use('/auth', authRoutes);
app.use('/social', socialRoutes);
app.use('/posts', postRoutes);
app.use('/user', userRoutes);



app.use(errorHandler);

module.exports = app;