import express from 'express';
import { login, signup } from '../controllers/authController'; // using named exports

const router = express.Router();

router.post('/signup', (req, res, next) => {
  signup(req, res);
});

router.post('/login', (req, res, next) => {
  login(req, res);
});

export default router;
