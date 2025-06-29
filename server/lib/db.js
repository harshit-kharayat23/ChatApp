import mongoose from 'mongoose'

export const connectDB=async()=>{

    try{
        await mongoose.connect(process.env.MONGODB_URL);

    }catch(err){
        console.log(err.message)
         process.exit(1); 
    }
        

}