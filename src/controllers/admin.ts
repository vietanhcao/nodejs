import { RequestHandler, Request } from "express";
import Product from "../models/product";
// import { Product } from '../models/product';
import { ObjectID } from 'mongodb';

export const getAddProduct: RequestHandler = (req, res, next)  => {
  // next(); // allow request to next continue middleware  in liners
  // console.log(rootDir)
  res.render('admin/edit-product', {
    pageTitle: "Add Product",
    path: '/admin/add-product'
  });
}
export const postAddProduct: RequestHandler  = async (req: any, res, next) => {
  const { title, price,  description, imageUrl } = req.body;
  const product = new Product(title, price, description, imageUrl, req.user._id);
  let dummy = await product.save();
  // await req.user.createProduct({
  //   title, imageUrl, description, price,
  // });
  // _product.push({ title: req.body.title })
  res.redirect('/');
}
export const getEditProduct: RequestHandler = async (req: any, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/');
  }
  const productId = req.params.productId;
  // let product = await Product.findByPk(productId);
  const product = await Product.findById(productId)
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
  const _product = new Product(title, price, description, imageUrl, pordId )
  await _product.save()
  res.redirect('/admin/products');
}

export const postDeleteProduct: RequestHandler = async (req:any, res, next) => {
  const { productId } = req.body;
  // Product.destroy({})
  let product = await Product.deleteById(productId)

  res.redirect('/admin/products');
}


export const getProducts: RequestHandler = async (req:any, res, next) => {
  let products = await Product.fetchAll();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  })
}