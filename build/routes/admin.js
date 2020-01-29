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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController = __importStar(require("../controllers/admin"));
const is_auth_1 = __importDefault(require("../middleware/is-auth"));
const express_validator_1 = require("express-validator");
const _adminRouter = express_1.default.Router();
// /admin/add-product => get
_adminRouter.get('/add-product', is_auth_1.default, adminController.getAddProduct);
// /adminproducts => get
_adminRouter.get('/products', is_auth_1.default, adminController.getProducts);
// /admin/product => post
_adminRouter.post('/add-product', is_auth_1.default, [
    express_validator_1.body('title', 'inValid title.').isString().isLength({ min: 3 }).trim(),
    express_validator_1.body('price', 'inValid price.').isFloat(),
    express_validator_1.body('description', 'inValid description.').isLength({ min: 5, max: 400 }).trim()
], adminController.postAddProduct);
_adminRouter.get('/edit-product:productId', is_auth_1.default, adminController.getEditProduct);
_adminRouter.post('/edit-product', is_auth_1.default, [
    express_validator_1.body('title', 'inValid title.').isString().isLength({ min: 3 }).trim(),
    express_validator_1.body('price', 'inValid price.').isFloat(),
    express_validator_1.body('description', 'inValid description.').isLength({ min: 5, max: 400 }).trim()
], adminController.postEditProduct);
_adminRouter.delete('/product/:productId', is_auth_1.default, adminController.deleteProduct);
exports.adminRouter = _adminRouter;
//# sourceMappingURL=admin.js.map