import { RequestHandler } from "express";
// import { Product } from '../models/product';
import { Cart } from '../models/cart';
import Product from "../models/product";


export const getProducts: RequestHandler = async (req, res, next) => {
  // res.sendFile(path.join(rootDir,'views','shop.html'))// not slash because on windown \ , linus use / dir
  try {
    const Products = await Product.findAll();
    res.render('shop/product-list', {
      prods: Products,
      pageTitle: 'All Product',
      path: '/products'
    });
  } catch (error) {
    console.log('get product', error)
  }
}

export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    let product = await Product.findByPk(prodId); //return //vonly product
    // let product :any[] = await Product.findAll({where:{
    //   id:prodId
    // }});//return array product match
    res.render('shop/product-detail', {
      product: product,
      pageTitle: 'Product-detail',
      path: '/products'
    });
  } catch (error) {
    console.log('get product', error)
  }
  
}

export const getIndex: RequestHandler = async (req, res, next) => {
  try {
    const Products = await Product.findAll();
    res.render('shop/index', {
      prods: Products,
      pageTitle: 'Shop',
      path: '/'
    });
  } catch (error) {
    console.log('get product', error)
  }
}
export const getCart: RequestHandler = async (req, res, next) => {
  // const cart = await Cart.getCart();
  // const products = await Product.fetchAll();
  // let cartProducts: any[];
  // cartProducts = products.reduce((arr, product) => {
  //   const cartProductData = cart.products.find(prod => prod.id === product.id);
  //   if (cartProductData) {
  //     arr.push({ productData: product, qty: cartProductData.qty });
  //   }
  //   return arr;
  // },[])
  // res.render('shop/cart', {
  //   products: cartProducts,
  //   pageTitle: 'Your Cart',
  //   path: '/cart'
  // })
}
export const postCart: RequestHandler = async (req, res, next) => {
  // const {productId} = req.body;
  // let product = await Product.findById(productId);
  // Cart.addProduct(product.id,product.price)
  // // res.render('shop/cart', {
  // //   // prods: products,
  // //   pageTitle: 'Your Cart',
  // //   path: '/cart'
  // // })
  // res.redirect('/cart')
}
export const postCartDeleteProduct: RequestHandler = async (req, res, next) => {
  // const {productId} = req.body;
  // let product = await Product.findById(productId);
  // Cart.deleteProduct(productId, product.price);
  // res.redirect('/cart');
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