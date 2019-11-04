import express from 'express';
import path from 'path';
import { getYourPath as rootDir } from '../ultil/path';
import * as adminController from "../controllers/admin";
const _adminRouter = express.Router();


// /admin/add-product => get
_adminRouter.get('/add-product', adminController.getAddProduct );

// // /adminproducts => get
_adminRouter.get('/products', adminController.getProducts );

// /admin/product => post
_adminRouter.post('/add-product', adminController.postAddProduct );

_adminRouter.get('/edit-product:productId', adminController.getEditProduct );

_adminRouter.post('/edit-product', adminController.postEditProduct );

_adminRouter.post('/delete-product', adminController.postDeleteProduct );

export const adminRouter = _adminRouter;

