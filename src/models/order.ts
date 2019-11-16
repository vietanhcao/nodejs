import mongoose ,{ Schema }  from "mongoose";



const orderSchema = new Schema({
  products :[{
    product:{
      type: Object,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  user: {
    userId : {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required:true
    },
    name: {
      type:String,
      required: true,
    }
  }
})

export default mongoose.model('Order', orderSchema);