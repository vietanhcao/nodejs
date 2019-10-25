import fs from 'fs';
import path from 'path';

interface ItemCartProducts {
  id:string;
  qty:number;
}

interface ItemCart {
  products: ItemCartProducts[];
  totalPrice: number;
}
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
      let cart: ItemCart = { products: [], totalPrice: 0 }
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
  static deleteProduct = (id:string, productPrice:string)=> {
    let cart: ItemCart; 
    fs.readFile(p, (err, fileContent) => {
      if(err){
        return;
      }//{"products":[{"id":"0.5088149628053462","qty":2},{"id":"0.6711327087339796","qty":1}],"totalPrice":96.12}
      cart = JSON.parse(fileContent.toString());
      const updatedCart = {...cart};
      const product = updatedCart.products.find(pro => pro.id === id);
      if (product === undefined){
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
      updatedCart.totalPrice = + updatedCart.totalPrice - ( + productPrice)  *  productQty;
      fs.writeFile(p, JSON.stringify(updatedCart), (error) => {
        if (error) console.log(error);
      })
    })

  }

  static getCart = (): Promise<ItemCart>=>{
    return new Promise((res,rej)=> {
      fs.readFile(p, (err, fileContent) => {
        const cart: ItemCart = JSON.parse(fileContent.toString());
        if(err){
          res(null);
        }
        res(cart);
      });
    })
    

  }
  // constructor(){
  //   this.products = [];
  //   this.totalPrice = 0;
  // }


}