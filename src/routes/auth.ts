import express from 'express';
import * as authController from '../controllers/auth';
const authRouter = express.Router();

authRouter.get('/login', authController.getLogin);

authRouter.post('/login', authController.postLogin);

authRouter.post('/logout', authController.postLogout);

authRouter.get('/signup', authController.getSignup);

authRouter.post('/signup', authController.postSignup);

authRouter.get('/reset', authController.getReset);

authRouter.post('/reset', authController.postReset);

authRouter.get('/reset/:token', authController.getNewPassword);

authRouter.post('/new-password', authController.postNewPassword);

export default authRouter;
