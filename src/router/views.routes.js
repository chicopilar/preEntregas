import {Router} from "express";
import ProductManager from "../managers/productManager.js";

const allProducts = new ProductManager();
const ViewRouter = Router();


ViewRouter.get("/", async(req, res)=>{  
    let products = await allProducts.readProducts()  
    res.render ("home",{products})
});

ViewRouter.get ("/realtimeproducts", async (req, res)=>{
    res.render ("realTimeProducts")
})


export default ViewRouter