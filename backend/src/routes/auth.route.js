// backend/src/routes/auth.route.js

import express from 'express';
import { signupController, loginController } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);

export default router;