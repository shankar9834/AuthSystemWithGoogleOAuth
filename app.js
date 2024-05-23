// server.js

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { authenticateJWT, isAdmin } = require('./middleware/authMiddleware');

const app = express();
const port = 3001;

app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/AuthVoosh';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRoutes);
app.use('/users', authenticateJWT, userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


