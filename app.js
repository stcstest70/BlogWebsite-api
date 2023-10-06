import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import dotenv from "dotenv";
dotenv.config({path:'./config.env'});
import connectDB from './conn.js'
import router from './router.js';
import cookieparser from "cookie-parser"

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());
app.use(cookieparser());
const PORT = process.env.PORT || 5000;
connectDB();
app.use(router);

app.set('trust proxy', 1);

// const allowedOrigins = [
//     "http://localhost:3000"
//   ];

// // Configure CORS middleware with the allowed origins and other options.
// app.use(cors({
//     origin: allowedOrigins,
//     methods: 'GET,POST,PUT,DELETE',
//     credentials: true, // Include credentials in the request (if needed).
//     optionsSuccessStatus: 204, // Return a 204 status for preflight requests.
//     allowedHeaders: 'Content-Type',
// }));


const corsOpts = {
    origin: '*',
    credentials: true,
    methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts));


app.listen(PORT, ()=>{
    console.log('Server is running on port ', PORT);
})