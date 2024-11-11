require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}).catch(error => console.error('Database connection error:', error));