// routes/userRoutes.js

const express = require('express');
const User = require('../model/User');

const router = express.Router();

router.get('/', async (req, res) => {
    console.log('hit ')
    try {
        let query = { profileVisibility: 'public' };
        if (req.user.role === 'admin') {
            query = {}; // Admins can see all profiles
        }
        const users = await User.find(query);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(req.user)
        if (user.profileVisibility === 'private' && req.user.role !== 'admin') {
            return res.status(403).send('Access denied to private profile');
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update profile visibility
router.patch('/:id/visibility', async (req, res) => {
    if (req.user._id !== req.params.id && req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');

        user.profileVisibility = req.body.profileVisibility || user.profileVisibility;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
