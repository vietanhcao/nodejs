import express from 'express';
import path from 'path';
import { getYourPath as rootDir } from '../ultil/path';
import * as adminController from '../controllers/admin';
import isAuth from '../middleware/is-auth';
const _adminRouter = express.Router();

// /admin/add-product => get
_adminRouter.get('/add-product', isAuth, adminController.getAddProduct);

// /adminproducts => get
_adminRouter.get('/products', isAuth, adminController.getProducts);

// /admin/product => post
_adminRouter.post('/add-product', isAuth, adminController.postAddProduct);

_adminRouter.get('/edit-product:productId', isAuth, adminController.getEditProduct);

_adminRouter.post('/edit-product', isAuth, adminController.postEditProduct);

_adminRouter.post('/delete-product', isAuth, adminController.postDeleteProduct);

export const adminRouter = _adminRouter;
