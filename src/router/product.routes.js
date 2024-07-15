import {Router} from "express";
import ProductManager from "../controllers/ProductManager.js";

const ProductRouter = Router();
const product = new ProductManager();


ProductRouter.get ("/", async (req,res)=> {
    res.send (await product.getProducts())
});
ProductRouter.get ("/:pid", async (req, res)=>{
    const id = parseInt(req.params.pid)
    const productId = await product.getProductsXId(id)
    if (productId){
        res.json (productId)
    }else{
        res.status(404).json ({message : "Producto no encontrado"})
    }
});

ProductRouter.post ("/", async (req, res)=>{
    let newProduct = req.body
    res.send (await product.addProducts(newProduct))
});

ProductRouter.put ("/:pid" , async (req, res) =>{
    let id = parseInt(req.params.pid)
    let updatedProduct = req.body
    res.send (await product.productUpdate(id, updatedProduct))
})

ProductRouter.delete ("/:pid", async (req,res)=>{
    let id = parseInt(req.params.pid)
    res.send (await product.deleteProduct(id))
})

export default ProductRouter