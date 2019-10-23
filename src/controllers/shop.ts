import { RequestHandler } from "express";
import { Product } from '../models/product';
import { Cart } from '../models/cart';


export const getProducts: RequestHandler = async (req, res, next) => {
  // res.sendFile(path.join(rootDir,'views','shop.html'))// not slash because on windown \ , linus use / dir
  const products = await Product.fetchAll();
  res.render('shop/product-list', {
    prods: products,
    pageTitle: 'All Product',
    path: '/products'
  })
}

export const getProduct: RequestHandler = async (req, res, next) => {
  const prodId = req.params.productId;
  let product = await Product.findById(prodId)
  res.render('shop/product-detail',{
    product,
    pageTitle: 'Product-detail',
    path: '/products'
  });
}

export const getIndex: RequestHandler = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  })
}
export const getCart: RequestHandler = async (req, res, next) => {
  res.render('shop/cart', {
    // prods: products,
    pageTitle: 'Your Cart',
    path: '/cart'
  })
}
export const postCart: RequestHandler = async (req, res, next) => {
  const {productId} = req.body;
  let product = await Product.findById(productId);
  Cart.addProduct(product.id,product.price)
  // res.render('shop/cart', {
  //   // prods: products,
  //   pageTitle: 'Your Cart',
  //   path: '/cart'
  // })
  res.redirect('/cart')
}
export const getOrders: RequestHandler = async (req, res, next) => {
  res.render('shop/orders', {
    // prods: products,
    pageTitle: 'Your Orders',
    path: '/orders'
  })
}
export const getCheckout: RequestHandler = async (req, res, next) => {
  res.render('shop/checkout', {
    // prods: products,
    pageTitle: 'Checkout',
    path: '/checkout'
  })
}











// export const adminData = _product;