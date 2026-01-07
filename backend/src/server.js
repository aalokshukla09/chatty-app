import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './library/db.js';

dotenv.config({ quiet: true });

const app = express(); // Initialize Express app

const PORT = process.env.PORT || 9000;

app.use(express.json()); // Middleware to parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
