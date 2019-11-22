
import { RequestHandler } from 'express';


export const getLogin: RequestHandler = async (req,res,next) => {
  // const dataCookie = req.get('Cookie');
  // const regex = /loggedIn=/g;
  // let isLoginIn: Boolean = false;
  // if (regex.test(dataCookie)){
  //   isLoginIn = JSON.parse(dataCookie.split('loggedIn=')[1]) //convert to boolean
  // }
  console.log(req.session.isLoggedIn)
  res.render('auth/login',{
    // orders,
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn
  });
};

export const postLogin: RequestHandler = async (req,res,next) => {
  req.session.isLoggedIn = true;
  res.redirect('/');
};