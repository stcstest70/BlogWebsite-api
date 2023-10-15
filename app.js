import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';
import dotenv from "dotenv";
dotenv.config({path:'./config.env'});
import connectDB from './conn.js'
import router from './router/router.js'
import cookieparser from "cookie-parser"

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.json());
app.use(cookieparser());

const corsOpts = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept'],
};

app.use(cors(corsOpts));
const PORT = process.env.PORT || 5000;
connectDB();
app.use(router);

app.set('trust proxy', 1);

app.listen(PORT, ()=>{
    console.log('Server is running on port ', PORT);
})