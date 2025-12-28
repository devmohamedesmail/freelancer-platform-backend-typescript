import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from './lib/prisma.js'
import { routes } from './routes/index.js';
const app = express();
const PORT = process.env.PORT || 3000;
import { v2 as cloudinary } from "cloudinary";
import http from 'http';
import { initIO } from './services/socket-io.js';
import Redis from 'redis'



const redisClient = Redis.createClient({
  // url
})







// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']

}));

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);



// Import routes
app.get('/', (req, res) => {
   res.json({message: 'Welcome to Tawsila API'});
});

// Use routes
routes(app);


/* ===================================  Socket.io Setup ===============================  */
const server = http.createServer(app);
const io = initIO(server);

// **************** Cloudinary Configuration ****************
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});