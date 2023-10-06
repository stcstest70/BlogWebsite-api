import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const DB = process.env.DATABASE;
        
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connection Successful');
    } catch (error) {
        console.log('Connection error:', error);
    }
};

export default connectDB;