"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Product } from '../models/product';
const product_1 = __importDefault(require("../models/product"));
const order_1 = __importDefault(require("../models/order"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_KEY);
const ITEMS_PER_PAGE = 2;
exports.getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // res.sendFile(path.join(rootDir,'views','shop.html'))// not slash because on windown \ , linus use / dir
    try {
        const page = +req.query.page || 1;
        const totalItems = yield product_1.default.find().countDocuments();
        const products = yield product_1.default.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
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
    }
    catch (error) {
        console.log('get product', error);
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.getProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prodId = req.params.productId;
        let product = yield product_1.default.findById(prodId); //return //vonly product
        res.render('shop/product-detail', {
            product: product,
            pageTitle: 'Product-detail',
            path: '/products'
        });
    }
    catch (error) {
        console.log('get product', error);
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.getIndex = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = +req.query.page || 1;
        const totalItems = yield product_1.default.find().countDocuments();
        const products = yield product_1.default.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
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
    }
    catch (error) {
        console.log('get product', error);
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield req.user
            .populate('cart.items.productId') //'cart.items.productId' => execute get data ref
            .execPopulate(); // wrap promise and excecuted
        let products = user.cart.items;
        res.render('shop/cart', {
            products: products,
            pageTitle: 'Your Cart',
            path: '/cart'
        });
    }
    catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.postCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        let product = yield product_1.default.findById(productId);
        yield req.user.addToCart(product);
        res.redirect('/cart');
    }
    catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.postCartDeleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        yield req.user.deleteItemFromCart(productId);
        res.redirect('/cart');
    }
    catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let orders = yield order_1.default.find({ 'user.userId': req.user._id });
        res.render('shop/orders', {
            orders,
            pageTitle: 'Your Orders',
            path: '/orders'
        });
    }
    catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.getCheckout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield req.user
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
    }
    catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.postOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Set your secret key: remember to change this to your live secret key in production
        // See your keys here: https://dashboard.stripe.com/account/apikeys
        // Token is created using Stripe Checkout or Elements!
        // Get the payment token ID submitted by the form:
        const token = req.body.stripeToken; // Using Express
        let user = yield req.user
            .populate('cart.items.productId') //'cart.items.productId' => execute get data ref
            .execPopulate(); // wrap promise and excecuted
        let products = user.cart.items;
        let totalSum = products.reduce((total, p) => {
            return total + p.quantity * p.productId.price;
        }, 0);
        products = products.map((o) => {
            return { product: Object.assign({}, o.productId._doc), quantity: o.quantity }; // destructor has _doc
        });
        const order = new order_1.default({
            products: products,
            user: {
                userId: req.user,
                email: req.user.email
            }
        });
        const result = yield order.save();
        //charges stripe
        const charge = yield stripe.charges.create({
            amount: totalSum * 100,
            currency: 'usd',
            description: 'Demo Order',
            source: token,
            metadata: {
                order_id: result._id.toString()
            }
        });
        yield req.user.clearCart();
        res.redirect('/orders');
    }
    catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.getInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        let order = yield order_1.default.findById(orderId);
        if (!order) {
            throw new Error('No order found!');
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {
            throw new Error('Unauthorized');
        }
        const invoiceName = 'Essential Grammar in Use 2nd Edition by R. Murphy - Book-' + orderId + '.pdf';
        const invoicePath = path_1.default.join('src', 'data', 'invoices', invoiceName);
        const pdfDoc = new pdfkit_1.default();
        res.setHeader('Content-Disposition', `inline; filename=${invoiceName}`);
        pdfDoc.pipe(fs_1.default.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text('Invoice', {
            underline: true
        });
        pdfDoc.text('------------------------------------------');
        let totalPrice = order.products.reduce((totalPrice, prod) => {
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
    }
    catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
// export const adminData = _product;
//# sourceMappingURL=shop.js.map