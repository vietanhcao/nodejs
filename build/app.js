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
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const admin_1 = require("./routes/admin");
const shop_1 = __importDefault(require("./routes/shop"));
const errorControllers = __importStar(require("./controllers/error"));
const path_2 = require("./util/path");
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./models/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const csurf_1 = __importDefault(require("csurf"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const multer_1 = __importDefault(require("multer"));
const is_auth_1 = __importDefault(require("./middleware/is-auth"));
const shopController = __importStar(require("./controllers/shop"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const rfs = __importStar(require("rotating-file-stream"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//TODO: morgan
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const logDirectory = path_1.default.join(__dirname, 'log');
// ensure log directory exists
fs_1.default.existsSync(logDirectory) || fs_1.default.mkdirSync(logDirectory);
// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory,
    maxFiles: 1
});
console.log(process.env.NODE_ENV);
const csurfProtection = csurf_1.default();
const MongoDBStore = connect_mongodb_session_1.default(express_session_1.default);
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');
const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env
    .MONGO_PASSWORD}@cluster0-iyrhv.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
const app = express_1.default();
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'sesstions'
});
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'build/images'); // place where we yarn start
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().toISOString()} - ${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
app.set('view engine', 'pug');
app.set('views', path_2.getYourPath + '/views');
app.use(helmet_1.default());
app.use(compression_1.default());
app.use(morgan_1.default('combined', { stream: accessLogStream }));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(multer_1.default({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
// app.disable('etag');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public'))); //file css
app.use('/build/images', express_1.default.static(path_1.default.join(__dirname, 'images'))); // '/' indicate root folder not to this project folder. ---- __dirname(app.ts) ->> images
app.use(express_session_1.default({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
app.use(connect_flash_1.default());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn; //You are passing the  object into the pug template
    next();
});
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // throw new Error('Dummy');
    try {
        if (!req.session.user) {
            return next();
        }
        let user = yield user_1.default.findById(req.session.user._id);
        if (!user) {
            return next();
        }
        req.user = user;
    }
    catch (error) {
        next(new Error(error));
    }
    next();
}));
// => rounter .....
app.post('/create-order', is_auth_1.default, shopController.postOrder); // not check protect csrf
app.use(csurfProtection);
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken(); // begin pass csrf to client
    next();
});
app.use('/admin', admin_1.adminRouter);
app.use(shop_1.default); //every thing not found in shop will swich to authRouter
app.use(auth_1.default);
app.get('/500', errorControllers.get500Page);
app.get('/404', errorControllers.get404Page);
app.use((error, req, res, next) => {
    console.log('TCL: error', error);
    // res.status(error.httpStatusCode)
    // res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '500',
        isAuthenticated: req.session.isLoggedIn
    });
});
// Product.sequelize.sync({ force: true, logging: console.log })
// setup relationship add one to many relationship
mongoose_1.default
    .connect(MONGODB_URL)
    .then((result) => __awaiter(void 0, void 0, void 0, function* () {
    app.listen(process.env.PORT || 3000);
    // https
    // 	.createServer({ key: privateKey, cert: certificate }, app).listen(process.env.PORT || 3000);
}))
    .catch((error) => {
    console.log(error);
});
//# sourceMappingURL=app.js.map