import express from 'express';
import path from 'path';
import { getYourPath as rootDir } from '../ultil/path';
import * as adminController from '../controllers/admin';
import isAuth from '../middleware/is-auth';
import { check, body } from 'express-validator';

const _adminRouter = express.Router();

// /admin/add-product => get
_adminRouter.get('/add-product', isAuth, adminController.getAddProduct);

// /adminproducts => get
_adminRouter.get('/products', isAuth, adminController.getProducts);

// /admin/product => post
_adminRouter.post(
	'/add-product',
	isAuth,
	[
		body('title', 'inValid title.').isString().isLength({ min: 3 }).trim(),

		body('price', 'inValid price.').isFloat(),
		body('description', 'inValid description.').isLength({ min: 5, max: 400 }).trim()
	],
	adminController.postAddProduct
);

_adminRouter.get('/edit-product:productId', isAuth, adminController.getEditProduct);

_adminRouter.post(
	'/edit-product',
	isAuth,
	[
		body('title', 'inValid title.').isString().isLength({ min: 3 }).trim(),

		body('price', 'inValid price.').isFloat(),
		body('description', 'inValid description.').isLength({ min: 5, max: 400 }).trim()
	],
	adminController.postEditProduct
);

_adminRouter.delete('/product/:productId', isAuth, adminController.deleteProduct);

export const adminRouter = _adminRouter;
