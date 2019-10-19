import express from 'express';
import path from 'path';
import { getYourPath as rootDir } from '../ultil/path';
import { getAddProduct, postAddProduct } from "../controllers/products";
const _adminRouter = express.Router();


// /admin/add-product => get
_adminRouter.get('/add-product', getAddProduct );

// /admin/product => post
_adminRouter.post('/product', postAddProduct );

export const adminRouter = _adminRouter;

