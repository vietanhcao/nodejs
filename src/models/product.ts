import fs from "fs";
import path from "path";

const products: any[] = []
export class Product {
  title: string
  constructor(title : any){
    this.title = title;
  }
  save(){
    const p = path.join(path.dirname(process.mainModule.filename),  
      'data',
      'products.json'
    );
    fs.readFile(p, (error,fileContent) => {
      let products:any = [];
      if(!error){
        products = JSON.parse(fileContent.toString());
      }
      console.log(this)
      products.push(this)
      fs.writeFile(p, JSON.stringify(products),(err)=> { 
        // console.log(err)
      })
    })

    // products.push(this);
  }

  static fetchAll(){
    const p = path.join(path.dirname(process.mainModule.filename),
      'data',
      'products.json'
    );
    return new Promise((res,rej)=>{
      fs.readFile(p,(err,fileContent)=>{
        if (err) res([]);
        res(JSON.parse(fileContent.toString()))
      })

    })
  }
}