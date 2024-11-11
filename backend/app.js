const express = require('express');
const passport = require('./config/passport');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/authRoutes');
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


app.use(errorHandler);

module.exports = app;