import { RequestHandler, Request } from "express";
import Product from "../models/product";
// import { Product } from '../models/product';

export const getAddProduct: RequestHandler = (req, res, next)  => {
  // next(); // allow request to next continue middleware  in liners
  // console.log(rootDir)
  res.render('admin/edit-product', {
    pageTitle: "Add Product",
    path: '/admin/add-product'
  });
}
export const postAddProduct: RequestHandler  = async (req: any, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  await req.user.createProduct({
    title, imageUrl, description, price,
  });
  // _product.push({ title: req.body.title })
  res.redirect('/');
}
export const getEditProduct: RequestHandler = async (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const productId = req.params.productId;
  let product = await Product.findByPk(productId);
  if(!product){
    return res.redirect('/');
  }
  res.render('admin/edit-product', {
    pageTitle: "Edit Product",
    path: '/admin/edit-product',
    editing: editMode,
    product: product
  });
  
}
export const postEditProduct: RequestHandler = async (req, res, next) => {
  const { pordId, title, imageUrl, description, price } = req.body;
  let product : any  = await Product.findByPk(pordId);
  product.title = title
  product.imageUrl = imageUrl
  product.description = description
  product.price = price
  await product.save()
  res.redirect('/admin/products');
}

export const postDeleteProduct: RequestHandler = async (req, res, next) => {
  const { productId } = req.body;
  // Product.destroy({})
  let product = await Product.findByPk(productId);
  product.destroy();
  res.redirect('/admin/products');
}


export const getProducts: RequestHandler = async (req, res, next) => {
  let products = await Product.findAll();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  })
}