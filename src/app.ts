
import express from "express";
import bodyParser from 'body-parser';
import path from "path";
import adminRouter from "./routes/admin";
import shopRouter from './routes/shop';


const app = express();


app.use(bodyParser.urlencoded({extended: false}));
// app.disable('etag');

app.use(express.static(path.join(__dirname,'public')))
console.log('ddddd',__dirname)
app.use('/admin',adminRouter);

app.use(shopRouter);

app.use((req,res,next)=> {
  res.status(404).sendFile(path.join(__dirname,'views','404.html'));
})

app.listen(3002);