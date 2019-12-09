import { RequestHandler } from 'express';

export const get404Page: RequestHandler = (req, res, next) => {
	res.status(404).render('404', { pageTitle: 'Page Not Pound', isAuthenticated: req.session.isLoggedIn });
};
export const get500Page: RequestHandler = (req, res, next) => {
	res.status(500).render('500', { pageTitle: 'Error!', path: '500', isAuthenticated: req.session.isLoggedIn });
};
