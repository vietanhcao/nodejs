import express from "express";

const router = express.Router();

router.use('/product-add', (req, res, next) => {
  // next(); // allow request to next continue middleware  in line
  res.send('<form action="/product" method="POST"><input type="text" name="title"/><button type="submit">add product</button></form>')
})

router.post('/product', (req, res, next) => {
  console.log(req.body);

  res.redirect('/')
})


module.exports = router 

