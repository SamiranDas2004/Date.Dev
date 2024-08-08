import mongoose from "mongoose";

type ConnectionObject ={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void> {
    if (connection.isConnected) {
        console.log("already connect");
        return        
    }

    try {
       const db= await mongoose.connect(process.env.DB_URI || "", {})
       connection.isConnected=db.connections[0].readyState
       console.log("db connected successfully");

    } catch (error) {
        console.error('Database connection failed:', error);

    // Graceful exit in case of a connection error
           process.exit(1);
    }
}
export default dbConnect