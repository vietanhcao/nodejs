import { MongoClient }   from "mongodb";

export const mongoConnected = MongoClient.connect(`mongodb+srv://vietanhcao:sao14111@cluster0-iyrhv.mongodb.net/test?retryWrites=true&w=majority`);



