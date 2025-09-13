// src/routes/auth.ts
import express from 'express';
import { register, login, adminLogin, refreshToken, getCurrentUser } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.post('/register', upload.single('profileImage'), register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/refresh-token', protect, refreshToken);
router.get('/me', protect, getCurrentUser); // This is the correct endpoint

export default router;