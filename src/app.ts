
import express from "express";
import bodyParser from 'body-parser';
import path from "path";
import { adminRouter } from "./routes/admin";
import shopRouter from './routes/shop';
import { get404Page } from './controllers/error';


const app = express();

app.set('view engine', 'pug');
app.set('views','src/views');

app.use(bodyParser.urlencoded({extended: false}));
// app.disable('etag');
app.use(express.static(path.join(__dirname,'public'))) //file css

// => rounter .....
app.use('/admin',adminRouter);
app.use(shopRouter);

app.use(get404Page)

app.listen(3002);