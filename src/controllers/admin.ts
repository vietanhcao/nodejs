import { RequestHandler } from "express";
// import { Product } from '../models/product';


export const getAddProduct: RequestHandler = (req, res, next) => {
  // next(); // allow request to next continue middleware  in liners
  // console.log(rootDir)
  res.render('admin/edit-product', {
    pageTitle: "Add Product",
    path: '/admin/add-product'
  });
}
export const postAddProduct: RequestHandler = async (req, res, next) => {
  // const { title, imageUrl, description, price } = req.body;
  // const product = new Product(null,title, imageUrl, description, price);
  // await product.save();
  
  // // _product.push({ title: req.body.title })
  // res.redirect('/');
}
export const getEditProduct: RequestHandler = async (req, res, next) => {
  // const editMode = req.query.edit;
  // if(!editMode){
  //   return res.redirect('/');
  // }
  // const productId = req.params.productId;
  // let [product, fiedData] = await Product.findById(productId);
  // if(!product[0]){
  //   return res.redirect('/');
  // }
  // res.render('admin/edit-product', {
  //   pageTitle: "Edit Product",
  //   path: '/admin/edit-product',
  //   editing: editMode,
  //   product: product[0]
  // });
  
}
export const postEditProduct: RequestHandler = async (req, res, next) => {
  // const { pordId, title, imageUrl, description, price } = req.body;
  // const updatedProduct = new Product(pordId, title, imageUrl, description, price);
  // updatedProduct.save();
  // res.redirect('/admin/products');
}

export const postDeleteProduct: RequestHandler = async (req, res, next) => {
  // const { productId } = req.body;
  // await Product.deleteById(productId);
  // // const updatedProduct = new Product(pordId, title, imageUrl, description, price);
  // // updatedProduct.save();
  // res.redirect('/admin/products');
}


export const getProducts: RequestHandler = async (req, res, next) => {
  // const [products, fiedData] = await Product.fetchAll();
  // res.render('admin/products', {
  //   prods: products,
  //   pageTitle: 'Admin Products',
  //   path: '/admin/products'
  // })
}