import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import {
  signup,
  login,
  googleLogin,
  googleOAuthCallback,
  protectedRoute
} from '../controllers/authController.js';
import User from '../models/User.js';

dotenv.config();

const router = express.Router();

// Configure Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Set up Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/auth/google/callback`,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user info from Google profile
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const googleId = profile.id;

        // Return user data to be used in the callback
        done(null, { email, name, googleId });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Regular auth routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin); // Keep for compatibility

// Google OAuth routes
router.get(
  '/google/start',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth?error=google_auth_failed`
  }),
  googleOAuthCallback
);

export default router;
