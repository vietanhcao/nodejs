
import express from "express";
import bodyParser from 'body-parser';
import path from "path";
import { adminRouter } from "./routes/admin";
import shopRouter from './routes/shop';
import { get404Page } from './controllers/error';
import { getYourPath } from './ultil/path';
import sequelize from "./ultil/database";
// import Product from "./models/product";
import { DataTypes } from "sequelize";

const app = express();



app.set('view engine', 'pug');
app.set('views', getYourPath + '/views');



app.use(bodyParser.urlencoded({extended: false}));
// app.disable('etag');
app.use(express.static(path.join(__dirname,'public'))) //file css

// => rounter .....
app.use('/admin',adminRouter);
app.use(shopRouter);

app.use(get404Page);
// Product.sequelize.sync({ force: true, logging: console.log })
// Product.create()

sequelize.sync()
  .then((result:any) => {
    // console.log('result');
    app.listen(3002);
  })
  .catch((err: any)=> {
    console.log(err)
  })

