import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hash });
    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ message: 'User already exists' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken(user);
  res.json({ token, user });
};

export const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { email, name, sub: googleId } = ticket.getPayload();

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name, googleId });
  }

  const token = generateToken(user);
  res.json({ token, user });
};

export const googleOAuthCallback = async (req, res) => {
  try {
    if (!req.user) {
      console.error('No user data in Google OAuth callback');
      return res.redirect(`${process.env.FRONTEND_URL}/auth?error=auth_failed`);
    }

    const { email, name, googleId } = req.user;
    
    console.log(`Google OAuth success for email: ${email}`);
    
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, googleId });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const token = generateToken(user);
    
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    console.log(`Redirecting to: ${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    return res.redirect(302, `${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/auth?error=server_error`);
  }
};

export const protectedRoute = (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
};
