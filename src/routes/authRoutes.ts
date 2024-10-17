import express from 'express';
import {
  login,
  protectedRoute,
  signup,
  refreshToken,
} from '../controllers/authController'; // using named exports
import authorized from '../utiles/authMiddleware';

const router = express.Router();

router.post('/signup', (req, res, next) => {
  signup(req, res);
});

router.post('/login', (req, res, next) => {
  login(req, res);
});

router.get('/protected', authorized, protectedRoute);

router.post('/refresh-token', (req, res, next) => {
  refreshToken(req, res);
});

export default router;
