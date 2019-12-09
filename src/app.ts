import express from 'express';
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
import { appendFile } from 'fs';

const csurfProtection = csurf();
const MongoDBStore = connect(session);

const MONGODB_URL = 'mongodb+srv://vietanhcao:sao14111@cluster0-iyrhv.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URL,
	collection: 'sesstions'
});

app.set('view engine', 'pug');
app.set('views', getYourPath + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
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

app.use(async (req, res, next) => {
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
		throw new Error(error);
	}

	next();
});

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn; //You are passing the  object into the pug template
	res.locals.csrfToken = req.csrfToken();
	next();
});

// => rounter .....
app.use('/admin', adminRouter);
app.use(shopRouter); //every thing not found in shop will swich to authRouter
app.use(authRouter);

app.get('/500', errorControllers.get500Page);
app.get('/404', errorControllers.get404Page);
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
