import { DB_URI } from "../../config/config.service.js"
import mongoose from 'mongoose' 
import { UserModel } from "./model/user.model.js";

export const connectDB = async ()=>{
try {
const result = await mongoose.connect(DB_URI , {serverSelectionTimeoutMS: 3000});
console.log(`DB connected successfully 👌`);
await UserModel.syncIndexes()

}
catch(error){
    console.log(`Fail to connect on DB........  ${error}`);
    
}
}