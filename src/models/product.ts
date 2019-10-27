
import { Cart } from './cart';
import db from "../ultil/database";

// const p = path.join(path.dirname(process.mainModule.filename),
//   'data',
//   'products.json'
// );
// const getProductFromFile = (): Promise<any[]>  =>  {
//   return new Promise((res, rej) => {
//       fs.readFile(p, (err, fileContent) => {
//         if (err) res([]);
//         res(JSON.parse(fileContent.toString()))
//       })
//   })
// }
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
    if (this.id){
      return db.execute('UPDATE products SET title = ?, price = ?, description = ?, imageUrl = ? WHERE id = ?',
        [this.title, this.price, this.description, this.imageUrl, this.id]
      )
    }else{
      return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
        [this.title, this.price, this.description, this.imageUrl]
      )
    }
    
  }
  static deleteById = async (id:string) =>{
    // const [products, fiedData]: [any[], any]  = await db.execute('SELECT * FROM products');
    // const product = products.find((prod=> prod.id === id));
    // const updateProducts = products.filter((prod=> prod.id !== id));
    return db.execute('DELETE FROM products WHERE id = ?', [id])
  }
  static fetchAll = async() =>{
    return  db.execute('SELECT * FROM products')

  } 
  static async findById(id: string) {
    return db.execute('SELECT * FROM products WHERE id = ?', [id]);
  }
}