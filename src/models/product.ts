import fs from "fs";
import path from "path";

const p = path.join(path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);
const getProductFromFile = ()  =>  {
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
  constructor(title: string, imageUrl?: string, description?: string, price?: string){
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
  async save(){
    let products : any = await getProductFromFile();
    products.push(this)
    fs.writeFile(p, JSON.stringify(products),(err)=> { 
      console.log(err)
    })
  }
  static  fetchAll(){
    return   getProductFromFile()
  }
}