import { RequestHandler, Request } from 'express';
import Product from '../models/product';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';

interface DocumentAddProperty extends Document {
	[key: string]: any;
}

export const getAddProduct: RequestHandler = (req, res, next) => {
	// next(); // allow request to next continue middleware  in liners
	// console.log(rootDir)
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/add-product',
		errorMessage: null,
		hasError: false
	});
};
export const postAddProduct: RequestHandler = async (req, res, next) => {
	const { title, price, description } = req.body;
	const image = req.file;
	console.log('TCL: postAddProduct:RequestHandler -> image', image);
	if (!image) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			errorMessage: 'Attached file is not an image.',
			editing: false,
			hasError: true,
			product: { title, price, description }
		});
	}
	const imageUrl = image.path;
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).render('admin/edit-product', {
				pageTitle: 'Add Product',
				path: '/admin/add-product',
				errorMessage: errors.array()[0].msg,
				editing: false,
				hasError: true,
				product: { title, price, description }
			});
		}
		const product = new Product({
			// _id: new Types.ObjectId('5de36467ddd7341c9c417555'),
			title: title,
			price,
			description,
			imageUrl,
			userId: (req as any).user._id
		});
		await product.save();
		res.redirect('/');
	} catch (error) {
		// console.log('TCL: postAddProduct:RequestHandler -> error', error);
		// return res.status(500).render('admin/edit-product', {
		// 	pageTitle: 'Add Product',
		// 	path: '/admin/add-product',
		// 	errorMessage: 'Database operation failed, please try again!',
		// 	editing: false,
		// 	hasError: true,
		// 	product: { title, price, description, image }
		// });
		// res.redirect('/500');
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
export const getEditProduct: RequestHandler = async (req: any, res, next) => {
	try {
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
			hasError: false,
			errorMessage: null
		});
	} catch (error) {
		console.log('TCL: getEditProduct:RequestHandler -> error', error);
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
export const postEditProduct: RequestHandler = async (req, res, next) => {
	const { pordId, title, description, price } = req.body;
	const image = req.file;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			path: '/admin/edit-product',
			errorMessage: errors.array()[0].msg,
			editing: true,
			hasError: true,
			product: { _id: pordId, title, price, description }
		});
	}
	try {
		let product: DocumentAddProperty = await Product.findById(pordId);
		if (product.userId.toString() !== (req as any).user._id.toString()) {
			return res.redirect('/');
		}
		product.title = title;
		product.description = description;
		product.price = price;
		if (image) {
			product.imageUrl = image.path;
		}
		await product.save();
		res.redirect('/admin/products');
	} catch (error) {
		console.log('TCL: postEditProduct:RequestHandler -> error', error);
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};

export const postDeleteProduct: RequestHandler = async (req: any, res, next) => {
	try {
		const { productId } = req.body;
		await Product.deleteOne({ _id: productId, userId: req.user._id });
		res.redirect('/admin/products');
	} catch (error) {
		console.log('TCL: postDeleteProduct:RequestHandler -> error', error);
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};

export const getProducts: RequestHandler = async (req: any, res, next) => {
	try {
		let products = await Product.find({ userId: req.user._id });
		// .select('title price -_id')//select poduct
		// .populate('userId', 'name')// seclect inside userId (related)
		// console.log('TCL: getProducts:RequestHandler -> products',products);
		// console.trace('TCL: getProducts:RequestHandler -> products',products);
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products'
		});
	} catch (error) {
		console.log('TCL: getProducts:RequestHandler -> error', error);
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
