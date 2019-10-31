import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { adminRouter } from './routes/admin';
import shopRouter from './routes/shop';
import { get404Page } from './controllers/error';
import { getYourPath } from './ultil/path';
import sequelize from './ultil/database';
import Product from './models/product';
import { DataTypes } from 'sequelize';
import User from './models/user';

const app = express();

app.set('view engine', 'pug');
app.set('views', getYourPath + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
// app.disable('etag');
app.use(express.static(path.join(__dirname, 'public'))); //file css

app.use(async (req: any, res, next) => {
	let user = await User.findByPk(1);
	req.user = user;
	next();
});

// => rounter .....
app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(get404Page);
// Product.sequelize.sync({ force: true, logging: console.log })
// add one to many relationship
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
	.sync()
	// {force:true} // override my table
	.then(async (result: any) => {
		let user = await User.findByPk(1);
		if (!user) {
			await User.create({
				name: 'Max',
				email: 'test@test.com'
			});
		}
		app.listen(3002);
	})
	.catch((err: any) => {
		console.log(err);
	});
