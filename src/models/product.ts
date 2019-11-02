import { getDb } from "../ultil/database";

// import { DataTypes, Model } from "sequelize";
// import sequelize from '../ultil/database';


class Product { 
  title: string;
  price: string;
  description: string;
  imageUrl: string;

  constructor(title: string, price: string, description: string, imageUrl: string) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save = async()=>{
    const db =  getDb();
    let response = await db.collection('products').insertOne(this);
    console.log(response);
    
  }
}

export default Product;