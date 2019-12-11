import express, { RequestHandler } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { adminRouter } from './routes/admin';
import shopRouter from './routes/shop';
import * as errorControllers from './controllers/error';
import { getYourPath } from './ultil/path';
import mongoose from 'mongoose';
import User from './models/user';
import authRouter from './routes/auth';
import session from 'express-session';
import connect from 'connect-mongodb-session';
import csurf from 'csurf';
import flash from 'connect-flash';
import multer from 'multer';
import { appendFile } from 'fs';

const csurfProtection = csurf();
const MongoDBStore = connect(session);

const MONGODB_URL = 'mongodb+srv://vietanhcao:sao14111@cluster0-iyrhv.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URL,
	collection: 'sesstions'
});
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'src/images');
	},
	filename: (req, file, cb) => {
		cb(null, `${new Date().toISOString()} - ${file.originalname}`);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};
app.set('view engine', 'pug');
app.set('views', getYourPath + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
// app.disable('etag');
app.use(express.static(path.join(__dirname, 'public'))); //file css
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store
	})
);
app.use(csurfProtection);
app.use(flash());
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn; //You are passing the  object into the pug template
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use(async (req, res, next) => {
	// throw new Error('Dummy');
	try {
		if (!req.session.user) {
			return next();
		}
		let user = await User.findById(req.session.user._id);
		if (!user) {
			return next();
		}
		(req as any).user = user;
	} catch (error) {
		next(new Error(error));
	}

	next();
});

// => rounter .....
app.use('/admin', adminRouter);
app.use(shopRouter); //every thing not found in shop will swich to authRouter
app.use(authRouter);

app.get('/500', errorControllers.get500Page);
app.get('/404', errorControllers.get404Page);
app.use((error, req, res, next) => {
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

mongoose
	.connect(MONGODB_URL)
	.then(async (result) => {
		app.listen(3002);
	})
	.catch((error) => {
		console.log(error);
	});
