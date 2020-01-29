"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    products: [
        {
            product: {
                type: Object,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        userId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }
});
exports.default = mongoose_1.default.model('Order', orderSchema);
//# sourceMappingURL=order.js.map