import { RequestHandler } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';

export const getLogin: RequestHandler = async (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/login', {
		// orders,
		pageTitle: 'Login',
		path: '/login',
		errorMessage: message
	});
};

export const getSignup: RequestHandler = async (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/signup', {
		pageTitle: 'Signup',
		path: '/signup',
		errorMessage: message
	});
};

export const postLogin: RequestHandler = async (req, res, next) => {
	const { email, password } = req.body;

	let user = await User.findOne({ email: email });
	if (!user) {
		req.flash('error', 'invalid email or password');
		return res.redirect('/login');
	}
	const doMatch = await bcrypt.compare(password, (user as any).password);
	if (!doMatch) {
		req.flash('error', 'invalid email or password');
		return res.redirect('/login');
	}
	req.session.user = user;
	req.session.isLoggedIn = true;
	req.session.save((err) => {
		// sometimes  store session in mongodb take miliseconds do that can be sure session has been create been
		if (err) {
			console.log('TCL: postLogin:RequestHandler -> err', err);
		}
		res.redirect('/');
	});
};

export const postSignup: RequestHandler = async (req, res, next) => {
	const { email, password, comfirmPassword } = req.body;
	let userDoc = await User.findOne({ email: email });
	if (userDoc) {
		req.flash('error', 'E-mail exists already, please  pick  a different one');
		return res.redirect('/signup');
	}
	const hashPassword = await bcrypt.hash(password, 12);
	const user = new User({
		email: email,
		password: hashPassword,
		cart: { items: [] }
	});
	await user.save();
	res.redirect('/login');
};
export const postLogout: RequestHandler = async (req, res, next) => {
	req.session.destroy((error) => {
		console.log('TCL: postLogout:RequestHandler -> error', error);
		res.redirect('/');
	});
};
