"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
// import { getDb } from "../ultil/database";
// import { ObjectID, ObjectId } from "mongodb";
// // import { DataTypes, Model } from "sequelize";
// // import sequelize from '../ultil/database';
// class Product { 
//   title: string;
//   price: string;
//   description: string;
//   imageUrl: string;
//   _id: ObjectId ;
//   userId: string ;
//   constructor(title: string, price: string, description: string, imageUrl: string, userId : string, id?: string) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.userId = userId;
//     this._id = id && new ObjectId(id);
//   }
//   save = async()=>{
//     const db =  getDb();
//     let response ;
//     if(this._id){
//       response = await db.collection('products').updateOne({
//         _id: this._id
//       },{
//           $set: this//ObjectID(id) not change _id database
//       })
//     }else{
//       response = await db.collection('products').insertOne(this);
//     }
//     return response;
//   }
//   static fetchAll = () => {
//     const db = getDb();
//     return db.collection('products').find().toArray();
//   }
//   static findById = (id:string) => {
//     const db = getDb();
//     return db.collection('products').find({
//       _id: new ObjectID(id)
//     }).next()
//   }
//   static deleteById = (id:string) => {
//     const db = getDb();
//     return db.collection('products').deleteOne({
//       _id: new ObjectID(id)
//     });
//   }
// }
exports.default = mongoose_1.default.model('Product', productSchema);
//# sourceMappingURL=product.js.map