import express from 'express';
import * as authController from "../controllers/auth";
const authRouter = express.Router();

authRouter.get('/login',authController.getLogin);

authRouter.post('/login',authController.postLogin);

export default authRouter;
