import { RequestHandler } from "express";
// import { Product } from '../models/product';
import Product from "../models/product";


export const getProducts: RequestHandler = async (req, res, next) => {
  // res.sendFile(path.join(rootDir,'views','shop.html'))// not slash because on windown \ , linus use / dir
  try {
    const Products = await Product.fetchAll();
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
    console.log(prodId)
    let product = await Product.findById(prodId); //return //vonly product
    console.log(product)
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
    const Products = await Product.fetchAll();
    res.render('shop/index', {
      prods: Products,
      pageTitle: 'Shop',
      path: '/'
    });
  } catch (error) {
    console.log('get product', error)
  }
}
export const getCart: RequestHandler = async (req :any, res, next) => {
  let cart = await req.user.getCart(); // get cart
  let cartProducts = await cart.getProducts();// cartItem association
  res.render('shop/cart', {
    products: cartProducts,
    pageTitle: 'Your Cart',
    path: '/cart'
  })
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
export const postCart: RequestHandler = async (req:any, res, next) => {
  // const {productId} = req.body;
  // let cart = await req.user.getCart(); // get cart
  // let newQuantity = 1;
  // let product ;
  // let products =  await cart.getProducts({
  //   where: {
  //     id: productId
  //   }
  // })
  // if (products.length > 0){
  //   product = products[0];
  // }
  // if(product){
  //   const oldQuantity = product.cartItem.quantity;
  //   newQuantity = oldQuantity + 1;
  //   cart.addProduct(product, {
  //     through: {
  //       quantity: newQuantity
  //     }
  //   })
  // }else{
  //   let productFind = await Product.findByPk(productId);
  //   cart.addProduct(productFind,{through: {
  //     quantity: newQuantity
  //   }})
  // }
  // let product = await Product.findById(productId);
  // Cart.addProduct(product.id,product.price)
  // // res.render('shop/cart', {
  // //   // prods: products,
  // //   pageTitle: 'Your Cart',
  // //   path: '/cart'
  // // })
  res.redirect('/cart') 
}
export const postCartDeleteProduct: RequestHandler = async (req:any, res, next) => {
  const {productId} = req.body;
  let cart = await req.user.getCart();
  let products = await cart.getProducts({
    where: {
      id: productId
    }
  })
  let product = products[0];
  product.cartItem.destroy();
  res.redirect('/cart');
  // let product = await Product.findById(productId);
  // Cart.deleteProduct(productId, product.price);
  
}
export const getOrders: RequestHandler = async (req:any, res, next) => {
  let orders = await req.user.getOrders({
    include: ['products'] //feching all order include products per order -- relation between order and product
  });
  res.render('shop/orders', {
    orders,
    pageTitle: 'Your Orders',
    path: '/orders'
  })
}
export const postOrder: RequestHandler = async (req: any, res, next) => {
  let cart = await req.user.getCart();
  let products = await cart.getProducts();
  let order = await req.user.createOrder();
  await order.addProducts(products.map( p => {
    p.orderItem = { quantity: p.cartItem.quantity}
    return p;
  }))
  await cart.setProducts(null);
  res.redirect('/orders')
}











// export const adminData = _product;