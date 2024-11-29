require('dotenv').config();
const http = require('http');
const {initializeSocket} = require('./config/socket');
const mongoose = require('mongoose');
const app = require('./app');


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');

  const server = http.createServer(app);
  console.log('HTTP server started');

  const io = initializeSocket(server);
  console.log('Socket Initialized');


  server.listen(3000, () => console.log('Server running on http://localhost:3000'));
}).catch(error => console.error('Database connection error:', error));