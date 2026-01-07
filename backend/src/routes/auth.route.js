import express from 'express';
import { signupController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup',signupController);

export default router;