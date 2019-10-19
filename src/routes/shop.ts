import express from "express";
import path from 'path';
import { util as rootDir } from '../ultil/path';
import { getShopProduct } from "../controllers/products";
const shopRouter = express.Router();



shopRouter.get('/', getShopProduct)

export = shopRouter;
