// import mysql from "mysql2";
import {Sequelize} from "sequelize";


const sequelize = new Sequelize('node-complete','root','sao14111',{
  dialect: 'mysql',
  host: 'localhost',
  logging: false
});
export default sequelize;