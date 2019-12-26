import express from 'express';
import path from 'path';
import { getYourPath as rootDir } from '../ultil/path';
import * as shopController from '../controllers/shop';
import isAuth from '../middleware/is-auth';

const shopRouter = express.Router();

shopRouter.get('/', shopController.getIndex);

shopRouter.get('/products', shopController.getProducts);

shopRouter.get('/products/:productId', shopController.getProduct);

shopRouter.get('/cart', isAuth, shopController.getCart);

shopRouter.post('/cart', isAuth, shopController.postCart);

shopRouter.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

shopRouter.get('/orders', isAuth, shopController.getOrders);


shopRouter.get('/orders/:orderId', isAuth, shopController.getInvoice);

shopRouter.get('/checkout', isAuth, shopController.getCheckout);

export = shopRouter;
