import express from "express";
import ProductManager from "./ProductManager.js";

const product = new ProductManager();

const app = express();
const PORT = 8080;

app.use (express.json())
app.use (express.urlencoded({extended:true}));

app.get ("/products" , async (req,res)=> {
    res.send (await product.getProducts())
});
app.get ("/products/:id", async(req, res)=>{
    const id = parseInt(req.params.id)
    const productId = await product.getProductsXId(id)
    if (productId){
        res.json (productId)
    }else{
        res.status(404).json ({message : "Producto no encontrado"})
    }
});

app.post ("/products", async (req, res)=>{
    let newProduct = req.body
    res.send (await product.addProducts(newProduct))
});

app.put ("/products/:id" , async (req, res) =>{
    let id = parseInt(req.params.id)
    let updatedProduct = req.body
    res.send (await product.productUpdate(id, updatedProduct))
})

app.delete ("/products/:id", async (req,res)=>{
    let id = parseInt(req.params.id)
    res.send (await product.deleteProduct(id))
})

app.listen (PORT,() => {
    console.log (`Server Express running on port: ${PORT}`);
});
