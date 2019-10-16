import express from "express";

const router = express.Router();



router.get('/',(req,res,next)=> {
  console.log('not ok');
  res.send('<h1>hello ok</h1>');
})

module.exports = router;
