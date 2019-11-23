import { RequestHandler } from 'express';
import User from '../models/user';

export const getLogin: RequestHandler = async (req,res,next) => {
	// const dataCookie = req.get('Cookie');
	// const regex = /loggedIn=/g;
	// let isLoggedIn: Boolean = false;
	// if (regex.test(dataCookie)){
	//   isLoggedIn = JSON.parse(dataCookie.split('loggedIn=')[1]) //convert to boolean
	// }
	console.log(req.session.isLoggedIn);
	res.render('auth/login',{
		// orders,
		pageTitle: 'Login',
		path: '/login',
		isAuthenticated: req.session.isLoggedIn
	});
};

export const postLogin: RequestHandler = async (req,res,next) => {
	let user = await User.findById('5dc93362cda16b33cce1f202');
	req.session.user = user;
	req.session.isLoggedIn = true;
	req.session.save((err) => { // sometimes  store session in mongodb take miliseconds do that can be sure session has been create been 
		if (err) {
			console.log("TCL: postLogin:RequestHandler -> err",err)
		}
		res.redirect('/');
	})
};
export const postLogout: RequestHandler = async (req,res,next) => {
	req.session.destroy((error) => {
		console.log('TCL: postLogout:RequestHandler -> error',error);
		res.redirect('/');
	});
};
