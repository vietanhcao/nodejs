import express from "express";
import path from 'path';
import { getYourPath as rootDir } from '../ultil/path';
import * as shopController from "../controllers/shop";
const shopRouter = express.Router();

shopRouter.get('/', shopController.getIndex)

shopRouter.get('/products', shopController.getProducts)



shopRouter.get('/products/:productId', shopController.getProduct  );



shopRouter.get('/cart', shopController.getCart);

shopRouter.post('/cart', shopController.postCart);

shopRouter.get('/Orders', shopController.getOrders);


shopRouter.get('/checkout', shopController.getCheckout);

export = shopRouter;
