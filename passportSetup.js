// passport-setup.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); // Import the User model

passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',  // for safety removed my id
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET', // removed my secret please use yours 
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    // Callback function
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                username: profile.displayName,
                googleId: profile.id,
                role: 'user',
                profileVisibility: 'public'
            });

            await user.save();
        }

        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
