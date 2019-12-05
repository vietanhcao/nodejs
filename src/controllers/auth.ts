import { RequestHandler } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import { get404Page } from './error';
// const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
	// sendgridTransport({
	// 	auth: {
	// 		api_key: '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'
	// 	}
	// })
	{
		service: 'gmail',
		auth: {
			user: 'vietanhcao1994@gmail.com',
			pass: 'sao14111'
		}
	}
);

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
		}
		res.redirect('/');
	});
};

export const postSignup: RequestHandler = async (req, res, next) => {
	const { email, password, comfirmPassword } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array());
		return res.status(422).render('auth/signup', {
			pageTitle: 'Signup',
			path: '/signup',
			errorMessage: errors.array()[0].msg
		});
	}
	const hashPassword = await bcrypt.hash(password, 12);
	const user = new User({
		email: email,
		password: hashPassword,
		cart: { items: [] }
	});
	await user.save();
	res.redirect('/login');
	// await transporter.sendMail({
	// 	to: email,
	// 	from: 'shop@node-complete.com',
	// 	subject: 'signup succeeded!',
	// 	html: '<h1> You successfully signup! </h1>'
	// });
};
export const postLogout: RequestHandler = async (req, res, next) => {
	req.session.destroy((error) => {
		res.redirect('/');
	});
};

export const getReset: RequestHandler = async (req, res, next) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render('auth/reset', {
		pageTitle: 'Reset',
		path: '/reset',
		errorMessage: message
	});
};

export const postReset: RequestHandler = async (req, res, next) => {
	const { email } = req.body;

	crypto.randomBytes(32, async (err, buffer) => {
		if (err) {
			return res.redirect('/reset');
		}
		const token = buffer.toString('hex');
		let userDoc = await User.findOne({ email: email });
		if (!userDoc) {
			req.flash('error', 'No account with that email found.');
			return res.redirect('/reset');
		}
		(userDoc as any).resetToken = token;
		(userDoc as any).resetTokenExpiration = Date.now() + 3600000;
		await userDoc.save();
		res.redirect('/');
		await transporter.sendMail({
			to: email,
			from: 'shop@node1-complete.com',
			subject: 'Password reset',
			html: `
					<p>You requested a password reset </p>
					<p>Click this   <a href="http://localhost:3002/reset/${token}"> link </a> to set a new password. </p>
			`
		});
	});
};

export const getNewPassword: RequestHandler = async (req, res, next) => {
	const token = req.params.token;
	let user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }); // gt => greater than
	if (user) {
		let message = req.flash('error');
		if (message.length > 0) {
			message = message[0];
		} else {
			message = null;
		}
		res.render('auth/new-password', {
			pageTitle: 'New Password',
			path: '/new-password',
			errorMessage: message,
			userId: user._id.toString(),
			passwordToken: token
		});
	} else {
		get404Page(req, res, next);
	}
};
export const postNewPassword: RequestHandler = async (req, res, next) => {
	const { password: newPassowrd, userId, passwordToken } = req.body;
	let restUser = await User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId
	});
	let hashedPassword = await bcrypt.hash(newPassowrd, 12);
	(restUser as any).password = hashedPassword;
	(restUser as any).resetToken = undefined;
	(restUser as any).resetTokenExpiration = undefined;
	await restUser.save();
	res.redirect('/login');
};
