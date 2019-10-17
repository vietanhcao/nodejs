import express from 'express';
import path from 'path';
import { util as rootDir } from '../ultil/path';

const adminRouter = express.Router();

// /admin/add-product => get
adminRouter.get('/add-product', (req, res, next) => {
  // next(); // allow request to next continue middleware  in liners
  console.log(rootDir)
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// /admin/product => post
adminRouter.post('/product', (req, res, next) => {
  console.log(req.body);
	res.redirect('/');
});

export = adminRouter;
