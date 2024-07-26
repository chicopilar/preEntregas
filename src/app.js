import express from "express";
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import ProductManager from "./managers/productManager.js";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import ViewRouter from "./router/views.routes.js";
import { Server } from "socket.io";


const app = express();
const PORT = 8080;

app.use (express.json())
app.use (express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use("/", ViewRouter)
app.use("/api/products", ProductRouter)
app.use("/api/carts", CartRouter)

const httpServer= app.listen (PORT,() => console.log (`Server Express running on port: ${PORT}`))
const socketServer = new Server(httpServer)
const allProducts = new  ProductManager();

let products = await allProducts.readProducts()

socketServer.on("connection", socket=>{
    socket.on('message', data=>{
        console.log(`Nuevo cliente conectado: ${data}`)
    })

    socket.emit('products', products);

    socket.on('addProduct', (product) => {
        allProducts.addProducts(product)
        product.id = products.length ? products[products.length -1].id +1:1;
        products.push(product)
        socket.emit('products', products); // Enviar lista actualizada a todos los clientes
    });
    
  
    socket.on('deleteProduct', (id) => {
        products = products.filter(product => product.id !== id)
        allProducts.deleteProduct(id)
        socket.emit('products', products); // Enviar lista actualizada a todos los clientes
    });

});


