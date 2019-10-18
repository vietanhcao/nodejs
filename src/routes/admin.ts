import express from 'express';
import path from 'path';
import { util as rootDir } from '../ultil/path';

const _adminRouter = express.Router();

const _product: any[] = [];

// /admin/add-product => get
_adminRouter.get('/add-product', (req, res, next) => {
  // next(); // allow request to next continue middleware  in liners
  // console.log(rootDir)
  res.render('add-product',{pageTitle: "Add Product", path: 'admin/add-product'});
});

// /admin/product => post
_adminRouter.post('/product', (req, res, next) => {
  // console.log(typeof req.body)
  _product.push({ title: req.body.title})
	res.redirect('/');
});

export const adminRouter = _adminRouter;
export const adminData  = _product ;
