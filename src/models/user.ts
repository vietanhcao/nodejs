import { getDb } from "../ultil/database";
import { ObjectId } from 'mongodb';


class User {
  name: string;
  email:string;
  constructor(username: string, email: string){
    this.name = username;
    this.email = email;
  }
  save = () => {
    const db = getDb();
    return db.collection('users').insertOne(this)
  }
  static findById = (id:string) =>{
    const db = getDb();
    return db.collection('users').findOne({_id:  new ObjectId(id)});
  }
}

export default User;