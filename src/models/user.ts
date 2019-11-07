import { getDb } from "../ultil/database";
import { ObjectId } from 'mongodb';

interface Cart {
  items: any[];
}

class User {
  name: string;
  email:string;
  cart: Cart;
  _id: ObjectId
  constructor(username: string, email: string, cart: Cart,id: string){
    this.name = username;
    this.email = email;
    this.cart = cart; // {item: []}
    this._id = id && new ObjectId(id);
  }
  save = () => {
    const db = getDb();
    return db.collection('users').insertOne(this)
  }
  addToCart = (product)=> {
    // {"cart": { "items": [{ "productId": "5dc0f0aa461ddd16803d166b", "quantity": 1 }] } }
    const cartProductIndex = this.cart.items.findIndex(e => {
      return e.productId.toString() === product._id.toString(); ///to stiing compare
    });
    const updateCartItem = [...this.cart.items];
    let newQuantity = 1;
    if (cartProductIndex >= 0){
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updateCartItem[cartProductIndex].quantity = newQuantity;
    }else{
      updateCartItem.push({ productId: new ObjectId(product._id), quantity: newQuantity })
    }
    const updateCart = { items: updateCartItem}
    const db = getDb();
    return db.collection('users').updateOne({ _id: this._id }, { $set: { cart: updateCart }});

  }
  static findById = (id:string) =>{
    const db = getDb();
    return db.collection('users').findOne({_id:  new ObjectId(id)});
  }
}

export default User;