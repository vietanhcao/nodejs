import fs from 'fs';
import path from 'path';

const p = path.join(path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);
export class Cart {
  products: any[];
  totalPrice: number;
  static addProduct(id:string, productPrice: string){
    //fetch the previous cart
    fs.readFile(p,(err,fileContent)=> {
      let cart: { products: any[], totalPrice:number } = { products: [], totalPrice: 0 }
      if(!err){
        cart = JSON.parse(fileContent.toString());
      }
      //analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(product => product.id === id);
      const existingProduct = cart.products[existingProductIndex];
      //Add new product/ increase quatity
      let updatedProduct;
      if (existingProduct){
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct ;

      }else{
        updatedProduct = { id: id, qty: 1  } ;
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + Number(productPrice);
      fs.writeFile(p, JSON.stringify(cart),(error)=> {
        if(error) console.log(error)
      } )
    })
    
    
  }

  // constructor(){
  //   this.products = [];
  //   this.totalPrice = 0;
  // }


}