import { DataTypes, Model } from "sequelize";
import sequelize from '../ultil/database';

class CartItem extends Model { }

CartItem.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: DataTypes.INTEGER,

}, {
  sequelize,
  modelName: 'cartItem'
})

export default CartItem