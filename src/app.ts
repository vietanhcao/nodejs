import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { adminRouter } from './routes/admin';
import shopRouter from './routes/shop';
import { get404Page } from './controllers/error';
import { getYourPath } from './ultil/path';
import sequelize from './ultil/database';
import Product from './models/product';
import User from './models/user';
import Cart from './models/cart';
import CartItem from './models/cart-item';
import Order from './models/order';
import OrderItem from './models/order-Item';

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
// setup relationship add one to many relationship
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through: CartItem});
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem })

sequelize
	.sync()
	// .sync({ force: true })// override my table
	.then(async (result: any) => {
		let user:any = await User.findByPk(1);
		if (!user) {
			user = await User.create({
				name: 'Max',
				email: 'test@test.com'
			});
		}
		user.createCart()
		app.listen(3002);
	})
	.catch((err: any) => {
		console.log(err);
	});
