import { RequestHandler } from "express";
import { Product } from '../models/product';


export const getAddProduct: RequestHandler = (req, res, next) => {
  // next(); // allow request to next continue middleware  in liners
  // console.log(rootDir)
  res.render('add-product', {
    pageTitle: "Add Product",
    path: 'admin/add-product'
  });
}
export const postAddProduct: RequestHandler = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();

  // _product.push({ title: req.body.title })
  res.redirect('/');
}
export const getShopProduct: RequestHandler = (req, res, next) => {
  // res.sendFile(path.join(rootDir,'views','shop.html'))// not slash because on windown \ , linus use / dir
  const products = Product.fetchAll();
  res.render('shop', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  })
}











// export const adminData = _product;