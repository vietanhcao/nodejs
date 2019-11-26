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
			path: '/products',
			isAuthenticated: req.session.isLoggedIn
		});
	} catch (error) {
		console.log('get product', error);
	}
};

export const getProduct: RequestHandler = async (req, res, next) => {
	try {
		const prodId = req.params.productId;
		let product = await Product.findById(prodId); //return //vonly product
		res.render('shop/product-detail', {
			product: product,
			pageTitle: 'Product-detail',
			path: '/products',
			isAuthenticated: req.session.isLoggedIn
		});
	} catch (error) {
		console.log('get product', error);
	}
};

export const getIndex: RequestHandler = async (req, res, next) => {
	try {
		const products = await Product.find();
		res.render('shop/index', {
			prods: products,
			pageTitle: 'Shop',
			path: '/',
			isAuthenticated: req.session.isLoggedIn,
			csrfToken: req.csrfToken()
		});
	} catch (error) {
		console.log('get product', error);
	}
};
export const getCart: RequestHandler = async (req: any, res, next) => {
	let user = await req.user
		.populate('cart.items.productId') //'cart.items.productId' => execute get data ref
		.execPopulate(); // wrap promise and excecuted
	let products = user.cart.items;

	res.render('shop/cart', {
		products: products,
		pageTitle: 'Your Cart',
		path: '/cart',
		isAuthenticated: req.session.isLoggedIn
	});
};
export const postCart: RequestHandler = async (req: any, res, next) => {
	const { productId } = req.body;
	let product = await Product.findById(productId);
	await req.user.addToCart(product);
	res.redirect('/cart');
};
export const postCartDeleteProduct: RequestHandler = async (req: any, res, next) => {
	const { productId } = req.body;
	await req.user.deleteItemFromCart(productId);
	res.redirect('/cart');
};
export const getOrders: RequestHandler = async (req: any, res, next) => {
	let orders: any = await Order.find({ 'user.userId': req.user._id });
	res.render('shop/orders', {
		orders,
		pageTitle: 'Your Orders',
		path: '/orders',
		isAuthenticated: req.session.isLoggedIn
	});
};
export const postOrder: RequestHandler = async (req: any, res, next) => {
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
			name: req.user.name
		}
	});
	await order.save();
	await req.user.clearCart();
	res.redirect('/orders');
};

// export const adminData = _product;
