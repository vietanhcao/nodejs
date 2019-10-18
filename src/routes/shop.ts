import express from "express";
import path from 'path';
import { util as rootDir } from '../ultil/path';
import { adminData } from "./admin";
const shopRouter = express.Router();



shopRouter.get('/',(req,res,next)=> {
  // res.sendFile(path.join(rootDir,'views','shop.html'))// not slash because on windown \ , linus use / dir
  res.render('shop', { prods: adminData, pageTitle: 'Shop', path:'/'})
})

export = shopRouter;
