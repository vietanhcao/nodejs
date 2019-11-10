import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { adminRouter } from './routes/admin';
import shopRouter from './routes/shop';
import { get404Page } from './controllers/error';
import { getYourPath } from './ultil/path';
import mongoose from 'mongoose';
import User from './models/user';


const app = express();

app.set('view engine', 'pug');
app.set('views', getYourPath + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
// app.disable('etag');
app.use(express.static(path.join(__dirname, 'public'))); //file css

app.use(async (req: any, res, next) => {
	let user = await User.findById('5dc051910898360637d6418f');
	req.user = new User(user.name,user.email, user.cart, user._id);
	next();
});

// => rounter .....
app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(get404Page);
// Product.sequelize.sync({ force: true, logging: console.log })
// setup relationship add one to many relationship

mongoose.connect('mongodb+srv://vietanhcao:sao14111@cluster0-iyrhv.mongodb.net/test?retryWrites=true&w=majority')
	.then(result => {
		app.listen(3002);
	}).catch(error => {
		console.log(error);
	})
