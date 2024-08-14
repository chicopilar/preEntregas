import express, { json, urlencoded } from 'express';
import configureRouter from './routes/product.routes.js';
import configureCartsRouter from './routes/carts.routes.js';
import viewsRouter from './routes/views.routes.js';
import handlebars from 'express-handlebars';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';
import __dirname from './utils.js';
import mongoose from 'mongoose';


const app = express();
const PORT = 8080;

mongoose.connect("mongodb+srv://juancgimenez87:d47U8DAkrRQIK3Gs@cluster0.mhrf0c3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(error => {
    console.error("Connection error", error);
  });

app.use (express.json())
app.use (express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars')

const httpServer= http.createServer(app)
const socketServer = new Server(httpServer)

socketServer.on("connection", socket=>{

    console.log("New client connected");
    /*
    socket.on('productData', data => {
        socketServer.emit('productData', data); 
    });
    */
    socket.on('removeProduct', data => {
        socketServer.emit('productRemoved', data);
    });
    
});
app.use("/api/carts", configureCartsRouter(socketServer)); 
app.use("/api/products", configureRouter(socketServer));
app.use("/", viewsRouter);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

