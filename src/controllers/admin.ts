import { RequestHandler, Request } from 'express';
import Product from '../models/product';
import { Document } from 'mongoose';

interface DocumentAddProperty extends Document {
	[key: string]: any;
}

export const getAddProduct: RequestHandler = (req, res, next) => {
	// next(); // allow request to next continue middleware  in liners
	// console.log(rootDir)
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		isAuthenticated: req.session.isLoggedIn
	});
};
export const postAddProduct: RequestHandler = async (req: any, res, next) => {
	const { title, price, description, imageUrl } = req.body;
	const product = new Product({
		title: title,
		price,
		description,
		imageUrl,
		userId: req.user._id
	});
	await product.save();
	res.redirect('/');
};
export const getEditProduct: RequestHandler = async (req: any, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}
	const productId = req.params.productId;
	// let product = await Product.findByPk(productId);
	const product = await Product.findById(productId);
	if (!product) {
		return res.redirect('/');
	}
	res.render('admin/edit-product', {
		pageTitle: 'Edit Product',
		path: '/admin/edit-product',
		editing: editMode,
		product: product,
		isAuthenticated: req.session.isLoggedIn
	});
};
export const postEditProduct: RequestHandler = async (req, res, next) => {
	const { pordId, title, imageUrl, description, price } = req.body;
	let product: DocumentAddProperty = await Product.findById(pordId);
	product.title = title;
	product.imageUrl = imageUrl;
	product.description = description;
	product.price = price;
	await product.save();
	res.redirect('/admin/products');
};

export const postDeleteProduct: RequestHandler = async (req: any, res, next) => {
	const { productId } = req.body;
	// Product.destroy({})
	let product = await Product.findByIdAndRemove(productId);

	res.redirect('/admin/products');
};

export const getProducts: RequestHandler = async (req: any, res, next) => {
	let products = await Product.find();
	// .select('title price -_id')//select poduct
	// .populate('userId', 'name')// seclect inside userId (related)
	// console.log('TCL: getProducts:RequestHandler -> products',products);
	// console.trace('TCL: getProducts:RequestHandler -> products',products);
	res.render('admin/products', {
		prods: products,
		pageTitle: 'Admin Products',
		path: '/admin/products',
		isAuthenticated: req.session.isLoggedIn
	});
};
