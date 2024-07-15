import {Router} from "express";
import CartManager from "../managers/cartManager.js"

const CartRouter = Router ();
const carts = new CartManager

CartRouter.get ("/", async (req, res)=>{
    res.send(await carts.readCarts())
})
CartRouter.get("/:cid", async (req,res)=>{
    res.send (await carts.getCartsXId(parseInt(req.params.cid)))
})
CartRouter.post("/", async(req, res) =>{
    res.send (await carts.addCart())
})
CartRouter.post("/:cid/products/:pid", async(req,res)=>{
    let cartId = parseInt(req.params.cid)
    let prodId = parseInt(req.params.pid)
    res.send (await carts.addProductInCart (cartId,prodId))
})

export default CartRouter