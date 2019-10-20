import { RequestHandler } from "express";
import { Product } from '../models/product';


export const getAddProduct: RequestHandler = (req, res, next) => {
  // next(); // allow request to next continue middleware  in liners
  // console.log(rootDir)
  res.render('admin/add-product', {
    pageTitle: "Add Product",
    path: '/admin/add-product'
  });
}
export const postAddProduct: RequestHandler = (req, res, next) => {
  const product = new Product(req.body.title);
  product.save();

  // _product.push({ title: req.body.title })
  res.redirect('/');
}

export const getProducts: RequestHandler = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  })
}