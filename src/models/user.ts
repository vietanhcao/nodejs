import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				},
				quantity: { type: Number, required: true }
			}
		]
	}
});
userSchema.methods.addToCart = function(product) {
	const cartProductIndex = this.cart.items.findIndex((e) => {
		return e.productId.toString() === product._id.toString(); ///to stiing compare
	});
	const updateCartItem = [ ...this.cart.items ];
	let newQuantity = 1;
	if (cartProductIndex >= 0) {
		newQuantity = this.cart.items[cartProductIndex].quantity + 1;
		updateCartItem[cartProductIndex].quantity = newQuantity;
	} else {
		updateCartItem.push({ productId: product._id, quantity: newQuantity });
	}
	const updateCart = { items: updateCartItem };
	this.cart = updateCart;
	return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  let updatedCartItems = this.cart.items.filter(o => {
    return o.productId.toString() !== productId.toString()
  })
  this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = async function () {
  this.cart.items = [];
  return  this.save()
}
export default mongoose.model('User', userSchema);
// import { getDb } from "../ultil/database";
// import { ObjectId } from 'mongodb';

// interface Cart {
//   items: any[];
// }

// class User {
//   name: string;
//   email:string;
//   cart: Cart;
//   _id: ObjectId
//   constructor(username: string, email: string, cart: Cart,id: string){
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {item: []}
//     this._id = id && new ObjectId(id);
//   }
//   save = () => {
//     const db = getDb();
//     return db.collection('users').insertOne(this)
//   }
//   addToCart = (product)=> {
//     // {"cart": { "items": [{ "productId": "5dc0f0aa461ddd16803d166b", "quantity": 1 }] } }
//     const cartProductIndex = this.cart.items.findIndex(e => {
//       return e.productId.toString() === product._id.toString(); ///to stiing compare
//     });
//     const updateCartItem = [...this.cart.items];
//     let newQuantity = 1;
//     if (cartProductIndex >= 0){
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updateCartItem[cartProductIndex].quantity = newQuantity;
//     }else{
//       updateCartItem.push({ productId: new ObjectId(product._id), quantity: newQuantity })
//     }
//     const updateCart = { items: updateCartItem}
//     const db = getDb();
//     return db.collection('users').updateOne({ _id: this._id }, { $set: { cart: updateCart }});

//   }
//   getCart = async() => {
//     // return this.cart;
//     const db = getDb();
//     const productIds = this.cart.items.map(e => e.productId);
//     let products = await db.collection('products').find({_id: {
//       $in: productIds
//     }}).toArray()
//     return products.map(p => {
//       return {
//         ...p,
//         quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
//       }
//     })
//   }
//   deleteItemFromCart = async (productId) => {
//     const db = getDb();
//     let updatedCartItems = this.cart.items.filter(o => {
//       return o.productId.toString() !== productId.toString()
//     })
//     const updateCart = { items: updatedCartItems }
//     return db.collection('users').updateOne({_id : this._id}, {$set : {cart: updateCart}});

//   }
//   addOrder = async() => {
//     const db = getDb();
//     let cartProducts = await this.getCart();
//     const order = {
//       item: cartProducts,
//       user: {
//         _id: new ObjectId(this._id),
//         name: this.name,
//         email:this.email,

//       }
//     }
//     await db.collection('orders').insertOne(order);// create collection and insert
//     return db.collection('users').updateOne({ _id: this._id }, { $set: { cart: { items: [] } } }) // clear cart
//   }
//   getOrders = async() => {
//     const db = getDb();
//     return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
//   }
//   static findById = (id:string) =>{
//     const db = getDb();
//     return db.collection('users').findOne({_id:  new ObjectId(id)});
//   }
// }
