import express from 'express';
import { check, body } from 'express-validator';
import * as authController from '../controllers/auth';
import User from '../models/user';
const authRouter = express.Router();

authRouter.get('/login', authController.getLogin);

authRouter.post('/login', authController.postLogin);

authRouter.post('/logout', authController.postLogout);

authRouter.get('/signup', authController.getSignup);

authRouter.post(
	'/signup',
	[
		check('email').isEmail().withMessage('Please enter a valid email.').custom(async (value, { req }) => {
			// if (value === 'test@test.com') {
			// 	throw new Error('This email address of forbiden.');
			// }
			// return true;
			let userDoc = await User.findOne({ email: value });
			if (userDoc) {
				return Promise.reject('E-mail exists already, please  pick  a different one');
			}
		}),
		body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
			.isLength({ min: 5 })
			.isAlphanumeric(),
		body('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Passwords have to match!');
			}
			return true;
		})
	],
	authController.postSignup
);

authRouter.get('/reset', authController.getReset);

authRouter.post('/reset', authController.postReset);

authRouter.get('/reset/:token', authController.getNewPassword);

authRouter.post('/new-password', authController.postNewPassword);

export default authRouter;
