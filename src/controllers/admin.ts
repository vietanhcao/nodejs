import { RequestHandler, Request } from 'express';
import Product from '../models/product';
import { Document, Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { deleteFile } from '../util/file';

interface DocumentAddProperty extends Document {
	[key: string]: any;
}

const ITEMS_PER_PAGE = 2;

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
			deleteFile(product.imageUrl);
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

export const deleteProduct: RequestHandler = async (req: any, res, next) => {
	try {
		const { productId } = req.params;
		let product: DocumentAddProperty = await Product.findById(productId);
		if (!product) {
			return next(new Error('Product not found!'));
		}
		deleteFile(product.imageUrl);

		await Product.deleteOne({ _id: productId, userId: req.user._id });
		res.status(200).json({ message: 'Success!' });
	} catch (error) {
		const err = new Error(error);
		res.status(500).json({ message: 'deleting product fail!' });
	}
};

export const getProducts: RequestHandler = async (req: any, res, next) => {
	try {
		// .select('title price -_id')//select poduct
		// .populate('userId', 'name')// seclect inside userId (related)
		// console.trace('TCL: getProducts:RequestHandler -> products',products);
		const page = +req.query.page || 1;

		const totalItems = await Product.find().countDocuments();

		const products = await Product.find({ userId: req.user._id })
			.skip((page - 1) * ITEMS_PER_PAGE)
			.limit(ITEMS_PER_PAGE);
		// const Products = await Product.find().cursor().next();
		res.render('admin/products', {
			prods: products,
			pageTitle: 'Admin Products',
			path: '/admin/products',
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
		});
	} catch (error) {
		console.log('TCL: getProducts:RequestHandler -> error', error);
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
