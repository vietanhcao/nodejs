import fs from "fs";
import path from "path";
import { Cart } from './cart';

const p = path.join(path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);
const getProductFromFile = (): Promise<any[]>  =>  {
  return new Promise((res, rej) => {
      fs.readFile(p, (err, fileContent) => {
        if (err) res([]);
        res(JSON.parse(fileContent.toString()))
      })
  })
}
export class Product {
  title: string;
  imageUrl: string;
  description: string;
  price: string;
  id:string;
  constructor(id : string, title: string, imageUrl?: string, description?: string, price?: string){
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  async save(){
    let products: any[] = await getProductFromFile();
    if(this.id){
      const exitingProductIndex = products.findIndex(prod => prod.id === this.id);
      const updatedProducts = [...products];
      updatedProducts[exitingProductIndex] = this;
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (err) console.log(err)
      })
    }else{
      this.id = Math.random().toString();
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) console.log(err) 
      })
    }
   
  }
  static deleteById = async (id:string) =>{
    let products: any[] = await getProductFromFile();
    const product = products.find(prod => prod.id === id);
    const updatedProducts = products.filter(prod => prod.id !== id);
    fs.writeFile(p, JSON.stringify(updatedProducts), error => {
      if(!error) {
        Cart.deleteProduct(id, product.price);
      }
    })
  }
  static  fetchAll= () =>{
    return   getProductFromFile()
  }
  static async findById(id: string): Promise<Product> {
    let products : any[] = await getProductFromFile();
    return products.find(o => o.id === id)
    
  }
}