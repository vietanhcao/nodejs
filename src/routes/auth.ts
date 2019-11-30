import express from 'express';
import * as authController from '../controllers/auth';
const authRouter = express.Router();

authRouter.get('/login', authController.getLogin);

authRouter.post('/login', authController.postLogin);

authRouter.post('/logout', authController.postLogout);

authRouter.get('/signup', authController.getSignup);

authRouter.post('/signup', authController.postSignup);

authRouter.get('/reset', authController.getReset);

export default authRouter;
