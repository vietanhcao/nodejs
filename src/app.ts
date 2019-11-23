import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { adminRouter } from './routes/admin';
import shopRouter from './routes/shop';
import { get404Page } from './controllers/error';
import { getYourPath } from './ultil/path';
import mongoose from 'mongoose';
import User from './models/user';
import authRouter from './routes/auth';
import session from 'express-session';
import connect from 'connect-mongodb-session';
const MongoDBStore = connect(session);

const MONGODB_URL = 'mongodb+srv://vietanhcao:sao14111@cluster0-iyrhv.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
	uri: MONGODB_URL,
	collection: 'sesstions'
});

app.set('view engine','pug');
app.set('views',getYourPath + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
// app.disable('etag');
app.use(express.static(path.join(__dirname,'public'))); //file css
app.use(
	session(
		{
			secret: 'my secret',
			resave: false,
			saveUninitialized: false,
			store: store
		}
	)
);

app.use(async (req,res,next) => {
	if (!req.session.user) {
		return next();
	}
	let user = await User.findById(req.session.user._id);
	(req as any).user = user;

	next();
})


// => rounter .....
app.use('/admin',adminRouter);
app.use(shopRouter); //every thing not found in shop will swich to authRouter
app.use(authRouter);

app.use(get404Page);
// Product.sequelize.sync({ force: true, logging: console.log })
// setup relationship add one to many relationship

mongoose
	.connect(MONGODB_URL)
	.then(async (result) => {
		let user = await User.findOne();
		if (!user) {
			user = new User({
				name: 'Max',
				email: 'max@test.com',
				cart: {
					items: []
				}
			});
		}
		user.save();
		app.listen(3002);
	})
	.catch((error) => {
		console.log(error);
	});
