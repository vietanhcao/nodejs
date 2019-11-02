import { MongoClient, Db }   from "mongodb";

let _db: Db  ;
export const mongoConnected = async () => {
  const mongoClient = await MongoClient.connect(`mongodb+srv://vietanhcao:sao14111@cluster0-iyrhv.mongodb.net/test?retryWrites=true&w=majority`);
  _db = mongoClient.db()
  return mongoClient
}
export const getDb  = () => {
  if(_db){
    return _db;
  }
  throw "No database found!";
}


