
import { RequestHandler } from 'express';


export const getLogin: RequestHandler = async (req,res,next) => {
  res.render('auth/login',{
    // orders,
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: (req as any).isLoginIn
  });
};

export const postLogin: RequestHandler = async (req,res,next) => {
  (req as any).isLoginIn = true;
  res.redirect('/');
};