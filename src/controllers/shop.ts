import { RequestHandler } from 'express';
// import { Product } from '../models/product';
import Product from '../models/product';
import Order from '../models/order';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const getProducts: RequestHandler = async (req, res, next) => {
	// res.sendFile(path.join(rootDir,'views','shop.html'))// not slash because on windown \ , linus use / dir
	try {
		// const Products = await Product.find().cursor().next();
		const products = await Product.find();
		res.render('shop/product-list', {
			prods: products,
			pageTitle: 'All Product',
			path: '/products'
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
		const products = await Product.find();
		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/'
			//
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
		console.log('TCL: getCart:RequestHandler -> error', error);
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
		console.log('TCL: postCart:RequestHandler -> error', error);
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
		console.log('TCL: postCartDeleteProduct:RequestHandler -> error', error);
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
		console.log('TCL: getOrders:RequestHandler -> error', error);
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
export const postOrder: RequestHandler = async (req: any, res, next) => {
	try {
		let user = await req.user
			.populate('cart.items.productId') //'cart.items.productId' => execute get data ref
			.execPopulate(); // wrap promise and excecuted
		let products = user.cart.items;
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
		await order.save();
		await req.user.clearCart();
		res.redirect('/orders');
	} catch (error) {
		console.log('TCL: postOrder:RequestHandler -> error', error);
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
		// 		console.log('TCL: getInvoice:RequestHandler -> err', err);
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
		console.log('TCL: getOrders:RequestHandler -> error', error);
		const err = new Error(error);
		(err as any).httpStatusCode = 500;
		return next(err);
	}
};
// export const adminData = _product;
