
import { RequestHandler } from 'express';


export const getLogin: RequestHandler = async (req,res,next) => {
  const dataCookie = req.get('Cookie');
  const regex = /loggedIn=/g;
  let isLoginIn: Boolean = false;
  if (regex.test(dataCookie)){
    isLoginIn = JSON.parse(dataCookie.split('loggedIn=')[1]) //convert to boolean
  }
  res.render('auth/login',{
    // orders,
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: isLoginIn
  });
};

export const postLogin: RequestHandler = async (req,res,next) => {
  res.setHeader('Set-Cookie','loggedIn=true; Max-Age=100; HttpOnly');
  res.redirect('/');
};