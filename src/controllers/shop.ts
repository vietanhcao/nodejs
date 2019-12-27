import { RequestHandler } from 'express';
// import { Product } from '../models/product';
import Product from '../models/product';
import Order from '../models/order';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_OuAYWPBmXlctjlJ1TdzMQOqh00H6VqKb1u');
const ITEMS_PER_PAGE = 2;

export const getProducts: RequestHandler = async (req, res, next) => {
	// res.sendFile(path.join(rootDir,'views','shop.html'))// not slash because on windown \ , linus use / dir
	try {
		const page = +req.query.page || 1;

		const totalItems = await Product.find().countDocuments();

		const products = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
		// const Products = await Product.find().cursor().next();
		res.render('shop/product-list', {
			prods: products,
			pageTitle: 'All Product',
			path: '/products',
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
		});
	} catch (error) {
		console.log('get product', error);
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};

export const getProduct: RequestHandler = async (req, res, next) => {
	try {
		const prodId = req.params.productId;
		let product = await Product.findById(prodId); //return //vonly product
		res.render('shop/product-detail', {
			product: product,
			pageTitle: 'Product-detail',
			path: '/products'
		});
	} catch (error) {
		console.log('get product', error);
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};

export const getIndex: RequestHandler = async (req, res, next) => {
	try {
		const page = +req.query.page || 1;

		const totalItems = await Product.find().countDocuments();

		const products = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/',
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < totalItems,
			hasPreviousPage: page > 1,
			nextPage: page + 1,
			previousPage: page - 1,
			lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
			// csrfToken: req.csrfToken()
		});
	} catch (error) {
		console.log('get product', error);
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
export const getCart: RequestHandler = async (req: any, res, next) => {
	try {
		let user = await req.user
			.populate('cart.items.productId') //'cart.items.productId' => execute get data ref
			.execPopulate(); // wrap promise and excecuted
		let products = user.cart.items;

		res.render('shop/cart', {
			products: products,
			pageTitle: 'Your Cart',
			path: '/cart'
		});
	} catch (error) {
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
export const postCart: RequestHandler = async (req: any, res, next) => {
	try {
		const { productId } = req.body;
		let product = await Product.findById(productId);
		await req.user.addToCart(product);
		res.redirect('/cart');
	} catch (error) {
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
export const postCartDeleteProduct: RequestHandler = async (req: any, res, next) => {
	try {
		const { productId } = req.body;
		await req.user.deleteItemFromCart(productId);
		res.redirect('/cart');
	} catch (error) {
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
export const getOrders: RequestHandler = async (req: any, res, next) => {
	try {
		let orders: any = await Order.find({ 'user.userId': req.user._id });
		res.render('shop/orders', {
			orders,
			pageTitle: 'Your Orders',
			path: '/orders'
		});
	} catch (error) {
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
export const getCheckout: RequestHandler = async (req: any, res, next) => {
	try {
		let user = await req.user
			.populate('cart.items.productId') //'cart.items.productId' => execute get data ref
			.execPopulate(); // wrap promise and excecuted
		let products = user.cart.items;
		let total = products.reduce((total, p) => {
			return total + p.quantity * p.productId.price;
		}, 0);
		res.render('shop/checkout', {
			products: products,
			pageTitle: 'Checkout',
			path: '/checkout',
			totalSum: total
		});
	} catch (error) {
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
export const postOrder: RequestHandler = async (req: any, res, next) => {
	try {
		// Set your secret key: remember to change this to your live secret key in production
		// See your keys here: https://dashboard.stripe.com/account/apikeys
		// Token is created using Stripe Checkout or Elements!
		// Get the payment token ID submitted by the form:
		const token = req.body.stripeToken; // Using Express

		let user = await req.user
			.populate('cart.items.productId') //'cart.items.productId' => execute get data ref
			.execPopulate(); // wrap promise and excecuted
		let products = user.cart.items;
		let totalSum = products.reduce((total, p) => {
			return total + p.quantity * p.productId.price;
		}, 0);
		products = products.map((o) => {
			return { product: { ...o.productId._doc }, quantity: o.quantity }; //_doc get all data
		});
		const order = new Order({
			products: products,
			user: {
				userId: req.user, //mogoose pick id there
				email: req.user.email
			}
		});
		const result = await order.save();
		//charges stripe
		const charge = await stripe.charges.create({
			amount: totalSum * 100,
			currency: 'usd',
			description: 'Demo Order',
			source: token,
			metadata: {
				order_id: result._id.toString()
			}
		});
		await req.user.clearCart();
		res.redirect('/orders');
	} catch (error) {
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
export const getInvoice: RequestHandler = async (req, res, next) => {
	try {
		const orderId = req.params.orderId;
		let order = await Order.findById(orderId);
		if (!order) {
			throw new Error('No order found!');
		}
		if ((order as any).user.userId.toString() !== (req as any).user._id.toString()) {
			throw new Error('Unauthorized');
		}
		const invoiceName = 'Essential Grammar in Use 2nd Edition by R. Murphy - Book-' + orderId + '.pdf';
		const invoicePath = path.join('src', 'data', 'invoices', invoiceName);

		const pdfDoc = new PDFDocument();
		res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);

		pdfDoc.pipe(fs.createWriteStream(invoicePath));
		pdfDoc.pipe(res);
		pdfDoc.fontSize(26).text('Invoice', {
			underline: true
		});
		pdfDoc.text('------------------------------------------');
		let totalPrice = (order as any).products.reduce((totalPrice, prod) => {
			pdfDoc.fontSize(14).text(`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`);
			return totalPrice + prod.quantity * prod.product.price;
		}, 0);
		pdfDoc.text(`---`);
		pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);
		pdfDoc.end();
		// fs.readFile(invoicePath, (err, data) => {
		// 	if (err) {
		// 		return next(err);
		// 	}
		// 	res.setHeader('Content-Type', 'application/pdf');
		// 	res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
		// 	res.send(data);
		// });
		// const file = fs.createReadStream(invoicePath);
		// res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
		// file.pipe(res);
	} catch (error) {
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
// export const adminData = _product;
