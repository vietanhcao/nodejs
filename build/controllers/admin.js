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
const product_1 = __importDefault(require("../models/product"));
const express_validator_1 = require("express-validator");
const file_1 = require("../util/file");
const ITEMS_PER_PAGE = 2;
exports.getAddProduct = (req, res, next) => {
    // next(); // allow request to next continue middleware  in liners
    // console.log(rootDir)
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        errorMessage: null,
        hasError: false
    });
};
exports.postAddProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const errors = express_validator_1.validationResult(req);
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
        const product = new product_1.default({
            // _id: new Types.ObjectId('5de36467ddd7341c9c417555'),
            title: title,
            price,
            description,
            imageUrl,
            userId: req.user._id
        });
        yield product.save();
        res.redirect('/');
    }
    catch (error) {
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
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.getEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const editMode = req.query.edit;
        if (!editMode) {
            return res.redirect('/');
        }
        const productId = req.params.productId;
        // let product = await Product.findByPk(productId);
        const product = yield product_1.default.findById(productId);
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
    }
    catch (error) {
        console.log('TCL: getEditProduct:RequestHandler -> error', error);
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.postEditProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pordId, title, description, price } = req.body;
    const image = req.file;
    const errors = express_validator_1.validationResult(req);
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
        let product = yield product_1.default.findById(pordId);
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }
        product.title = title;
        product.description = description;
        product.price = price;
        if (image) {
            file_1.deleteFile(product.imageUrl);
            product.imageUrl = image.path;
        }
        yield product.save();
        res.redirect('/admin/products');
    }
    catch (error) {
        console.log('TCL: postEditProduct:RequestHandler -> error', error);
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        let product = yield product_1.default.findById(productId);
        if (!product) {
            return next(new Error('Product not found!'));
        }
        file_1.deleteFile(product.imageUrl);
        yield product_1.default.deleteOne({ _id: productId, userId: req.user._id });
        res.status(200).json({ message: 'Success!' });
    }
    catch (error) {
        const err = new Error(error);
        res.status(500).json({ message: 'deleting product fail!' });
    }
});
exports.getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // .select('title price -_id')//select poduct
        // .populate('userId', 'name')// seclect inside userId (related)
        // console.trace('TCL: getProducts:RequestHandler -> products',products);
        const page = +req.query.page || 1;
        const totalItems = yield product_1.default.find().countDocuments();
        const products = yield product_1.default.find({ userId: req.user._id })
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
    }
    catch (error) {
        console.log('TCL: getProducts:RequestHandler -> error', error);
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
//# sourceMappingURL=admin.js.map