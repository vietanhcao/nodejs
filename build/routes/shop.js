"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
const express_1 = __importDefault(require("express"));
const shopController = __importStar(require("../controllers/shop"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const shopRouter = express_1.default.Router();
shopRouter.get('/', shopController.getIndex);
shopRouter.get('/products', shopController.getProducts);
shopRouter.get('/products/:productId', shopController.getProduct);
shopRouter.get('/cart', is_auth_1.default, shopController.getCart);
shopRouter.post('/cart', is_auth_1.default, shopController.postCart);
shopRouter.post('/cart-delete-item', is_auth_1.default, shopController.postCartDeleteProduct);
shopRouter.get('/orders', is_auth_1.default, shopController.getOrders);
shopRouter.get('/orders/:orderId', is_auth_1.default, shopController.getInvoice);
shopRouter.get('/checkout', is_auth_1.default, shopController.getCheckout);
module.exports = shopRouter;
//# sourceMappingURL=shop.js.map