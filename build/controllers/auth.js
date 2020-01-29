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
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
// const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer_1.default.createTransport(
// sendgridTransport({
// 	auth: {
// 		api_key: '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'
// 	}
// })
{
    service: 'gmail',
    auth: {
        user: 'vietanhcao1994@gmail.com',
        pass: 'sao14111'
    }
});
exports.getLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('auth/login', {
        // orders,
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationError: {}
    });
});
exports.postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        const dataValidationError = errors.array().reduce((x, y) => {
            //validate to view
            x[y.param] = y.param;
            return x;
        }, {});
        console.log(errors.array());
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationError: dataValidationError
        });
    }
    try {
        let user = yield user_1.default.findOne({ email: email });
        const doMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!doMatch) {
            req.flash('error', 'invalid password');
            return res.status(422).render('auth/login', {
                pageTitle: 'Login',
                path: '/login',
                errorMessage: 'invalid password',
                oldInput: {
                    email: email,
                    password: password
                },
                validationError: { password: 'password' }
            });
        }
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
            // sometimes  store session in mongodb take miliseconds do that can be sure session has been create been
            if (err) {
            }
            res.redirect('/');
        });
    }
    catch (error) {
        console.log('TCL: error', error);
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.getSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            comfirmPassword: ''
        }
        // validationError: []
    });
});
exports.postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, confirmPassword } = req.body;
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array(), confirmPassword);
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            }
            // validationError: errors.array()
        });
    }
    try {
        const hashPassword = yield bcryptjs_1.default.hash(password, 12);
        const user = new user_1.default({
            email: email,
            password: hashPassword,
            cart: { items: [] }
        });
        yield user.save();
        res.redirect('/login');
        // await transporter.sendMail({
        // 	to: email,
        // 	from: 'shop@node-complete.com',
        // 	subject: 'signup succeeded!',
        // 	html: '<h1> You successfully signup! </h1>'
        // });
    }
    catch (error) {
        console.log('TCL: postSignup:RequestHandler -> error', error);
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.postLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((error) => {
        res.redirect('/');
    });
});
exports.getReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    res.render('auth/reset', {
        pageTitle: 'Reset',
        path: '/reset',
        errorMessage: message
    });
});
exports.postReset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    crypto_1.default.randomBytes(32, (err, buffer) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.redirect('/reset');
        }
        try {
            const token = buffer.toString('hex');
            let userDoc = yield user_1.default.findOne({ email: email });
            if (!userDoc) {
                req.flash('error', 'No account with that email found.');
                return res.redirect('/reset');
            }
            userDoc.resetToken = token;
            userDoc.resetTokenExpiration = Date.now() + 3600000;
            yield userDoc.save();
            res.redirect('/');
            //send many email ~ 5000
            const users = [1];
            for (let i = 0; i < users.length; i += 100) {
                const request = users.slice(i, i + 100).map((user) => __awaiter(void 0, void 0, void 0, function* () {
                    return yield transporter.sendMail({
                        to: email,
                        from: 'shop@node1-complete.com',
                        subject: 'Password reset',
                        html: `
							<p>You requested a password reset </p>
							<p>Click this   <a href="http://localhost:3002/reset/${token}"> link </a> to set a new password. </p>
					`
                    }).catch(e => console.log('Error in sending email fok' + user + e));
                }));
                yield Promise.all(request).catch(e => console.log('Error in sending email fok' + i + e));
            }
            // await transporter.sendMail({
            // 	to: email,
            // 	from: 'shop@node1-complete.com',
            // 	subject: 'Password reset',
            // 	html: `
            // 		<p>You requested a password reset </p>
            // 		<p>Click this   <a href="http://localhost:3002/reset/${token}"> link </a> to set a new password. </p>
            // `
            // });
        }
        catch (error) {
            console.log('TCL: postReset:RequestHandler -> error', error);
            const err = new Error(error);
            err.httpStatusCode = 500;
            return next(err);
        }
    }));
});
exports.getNewPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        let user = yield user_1.default.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }); // gt => greater than
        if (user) {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            }
            else {
                message = null;
            }
            res.render('auth/new-password', {
                pageTitle: 'New Password',
                path: '/new-password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        }
        else {
            res.redirect('/404');
        }
    }
    catch (error) {
        console.log('TCL: getNewPassword:RequestHandler -> error', error);
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
exports.postNewPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password: newPassowrd, userId, passwordToken } = req.body;
        let restUser = yield user_1.default.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId
        });
        let hashedPassword = yield bcryptjs_1.default.hash(newPassowrd, 12);
        restUser.password = hashedPassword;
        restUser.resetToken = undefined;
        restUser.resetTokenExpiration = undefined;
        yield restUser.save();
        res.redirect('/login');
    }
    catch (error) {
        console.log('TCL: postNewPassword:RequestHandler -> error', error);
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
});
//# sourceMappingURL=auth.js.map