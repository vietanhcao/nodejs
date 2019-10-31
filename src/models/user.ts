
import { Model, DataTypes } from 'sequelize';
import sequelize from '../ultil/database';

class User extends Model {};
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,

},{
  sequelize,
  modelName: 'user'

})

export default User