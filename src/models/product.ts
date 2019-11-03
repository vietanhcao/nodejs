import { getDb } from "../ultil/database";
import { ObjectID } from "mongodb";

// import { DataTypes, Model } from "sequelize";
// import sequelize from '../ultil/database';


class Product { 
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  _id: ObjectID;

  constructor(title: string, price: string, description: string, imageUrl: string, id?: ObjectID) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  save = async()=>{
    const db =  getDb();
    let response ;
    if(this._id){
      response = await db.collection('products').updateOne({
        _id: new ObjectID(this._id) //can remove objectID
      },{
          $set: this//ObjectID(id) not change _id database
      })
    }else{
      response = await db.collection('products').insertOne(this);
    }
    return response;
  }
  static fetchAll = () => {
    const db = getDb();
    return db.collection('products').find().toArray();
  }
  static findById = (id:string) => {
    const db = getDb();
    return db.collection('products').find({
      _id: new ObjectID(id)
    }).next()
  }
}

export default Product;