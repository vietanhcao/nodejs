import express from "express";
import path from 'path';
import { util as rootDir } from '../ultil/path';
import { adminData } from "./admin";
const shopRouter = express.Router();



shopRouter.get('/',(req,res,next)=> {
  console.log(adminData);
  res.sendFile(path.join(rootDir,'views','shop.html'))// not slash because on windown \ , linus use / dir
  //'/views/shop.html'
})

export = shopRouter;
