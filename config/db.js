const mongoose = require("mongoose");
const connectDB = async ()=>{
   try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connect successfully")
   } catch (error) {
    console.log(error,"Mongo is not connected!")
   }

}
module.exports = connectDB