// routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport =require('passport')
const User = require('../model/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        username,
        password: hashedPassword,
        role
    });
    console.log("hit register",user);

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('hit login')

    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Username or password is wrong');

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    const token = jwt.sign({ _id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.header('Authorization', token).send({ token });
});

// Google OAuth Login
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Google OAuth Callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home with token
        const token = jwt.sign({ _id: req.user._id, role: req.user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.redirect(`/profile?token=${token}`);
    }
);

module.exports = router;
