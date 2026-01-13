import express from 'express';
import { signupController, loginController, logoutController, updateProfileController } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import  { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtection)

// router.get('/test',arcjetProtection, (req, res) => res.send('Test route'));

router.post('/signup',signupController);
router.post('/login',loginController);
router.post('/logout',logoutController);

router.put('update-profile', protectRoute, updateProfileController);

router.get('/check',protectRoute,(req,res) => res.send(req.user));

export default router;