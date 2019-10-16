
import express from "express";
import bodyParser from 'body-parser';

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
// import shopRouter from './routes/shop';

// console.log(adminRouter)

const app = express();


app.use(bodyParser.urlencoded({extended: false}));
// app.disable('etag');

app.use('/admin',adminRouter);
app.use(shopRouter);

app.use((req,res,next)=> {
  res.status(404).send('<h1>Page not pound</h1>');
})

app.listen(3002);