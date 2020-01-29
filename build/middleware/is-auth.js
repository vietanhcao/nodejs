"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.status(401).redirect('/login');
    }
    next();
};
exports.default = isAuth;
//# sourceMappingURL=is-auth.js.map