
import express from "express";
import bodyParser from 'body-parser';
import path from "path";
import { adminRouter } from "./routes/admin";
import shopRouter from './routes/shop';


const app = express();

app.set('view engine', 'pug');
app.set('views','src/views');

app.use(bodyParser.urlencoded({extended: false}));
// app.disable('etag');

app.use(express.static(path.join(__dirname,'public'))) //file css

app.use('/admin',adminRouter);

app.use(shopRouter);

app.use((req,res,next)=> {
  res.status(404).render('404', { pageTitle:'Page Not Pound'});
})

app.listen(3002);