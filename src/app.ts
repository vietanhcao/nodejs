import express, { RequestHandler } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { adminRouter } from './routes/admin';
import shopRouter from './routes/shop';
import * as errorControllers from './controllers/error';
import { getYourPath } from './util/path';
import mongoose from 'mongoose';
import User from './models/user';
import authRouter from './routes/auth';
import session from 'express-session';
import connect from 'connect-mongodb-session';
import csurf from 'csurf';
import flash from 'connect-flash';
import multer from 'multer';
import { appendFile } from 'fs';
import isAuth from './middleware/is-auth';
import * as shopController from './controllers/shop';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config()

console.log(process.env.NODE_ENV);

const csurfProtection = csurf();
const MongoDBStore = connect(session);

const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-iyrhv.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URL,
	collection: 'sesstions'
});
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'src/images');// place where we yarn start 
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

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
// app.disable('etag');
app.use(express.static(path.join(__dirname, 'public'))); //file css
app.use('/src/images', express.static(path.join(__dirname, 'images'))); // '/' indicate root folder not to this project folder. ---- __dirname(app.ts) ->> images
app.use(
	session({
		secret: 'my secret',
		resave: false,
		saveUninitialized: false,
		store: store
	})
);

app.use(flash());
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn; //You are passing the  object into the pug template
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
app.post('/create-order', isAuth, shopController.postOrder); // not check protect csrf

app.use(csurfProtection);
app.use((req, res, next) => {
	res.locals.csrfToken = req.csrfToken();// begin pass csrf to client
	next();
});
app.use('/admin', adminRouter);
app.use(shopRouter); //every thing not found in shop will swich to authRouter
app.use(authRouter);

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

mongoose
	.connect(MONGODB_URL)
	.then(async (result) => {
		app.listen(process.env.PORT || 3000);
	})
	.catch((error) => {
		console.log(error);
	});
