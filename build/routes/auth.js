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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController = __importStar(require("../controllers/auth"));
const user_1 = __importDefault(require("../models/user"));
const authRouter = express_1.default.Router();
authRouter.get('/login', authController.getLogin);
authRouter.post('/login', [
    express_validator_1.check('email')
        .isEmail()
        .withMessage('Please enter a email.')
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        let user = yield user_1.default.findOne({ email: value });
        if (!user) {
            return Promise.reject('invalid email');
        }
    }))
        .normalizeEmail(),
    express_validator_1.body('password', 'Password has to be valid.').isLength({ min: 5 }).isAlphanumeric().trim()
], authController.postLogin);
authRouter.post('/logout', authController.postLogout);
authRouter.get('/signup', authController.getSignup);
authRouter.post('/signup', [
    express_validator_1.check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
        // if (value === 'test@test.com') {
        // 	throw new Error('This email address of forbiden.');
        // }
        // return true;
        let userDoc = yield user_1.default.findOne({ email: value });
        if (userDoc) {
            return Promise.reject('E-mail exists already, please  pick  a different one');
        }
    }))
        .normalizeEmail(),
    express_validator_1.body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    express_validator_1.body('confirmPassword').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true; //optional
    })
], authController.postSignup);
authRouter.get('/reset', authController.getReset);
authRouter.post('/reset', authController.postReset);
authRouter.get('/reset/:token', authController.getNewPassword);
authRouter.post('/new-password', authController.postNewPassword);
exports.default = authRouter;
//# sourceMappingURL=auth.js.map