import { RequestHandler } from 'express';
// import { Product } from '../models/product';
import Product from '../models/product';
import Order from '../models/order';

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

// export const adminData = _product;
