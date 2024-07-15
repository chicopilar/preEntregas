import {promises as fs} from 'fs';
import ProductManager from './ProductManager.js';

const prodAll = new ProductManager

class CartManager{
    
    constructor(){
        this.path = "./src/carts.json";
    }
    
    readCarts = async()=>{
        let carts = await fs.readFile(this.path,"utf-8")
        return JSON.parse(carts);
    };

    exist = async (id)=>{
        let cart = await this.readCarts()
        return cart.find(c => c.id === id)
    }

    writeCarts = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart));
    }

    addCart = async ()=>{
        let cartsReaded = await this.readCarts();
        let nextId = cartsReaded.length ? cartsReaded[cartsReaded.length -1].id +1:1;
        let allCarts = [...cartsReaded,{"id": nextId, "products":[]}];
        await this.writeCarts(allCarts);
        return "Carrito Agregado";
    }
    
    getCartsXId = async(id) => {
        let cartsXId = await this.exist(id)
        if (!cartsXId) return `Carrito ${id} no encontrado`
        return cartsXId
    };

    addProductInCart = async (cartId , prodId) =>{
        let cartsXId = await this.exist(cartId);
        if (!cartsXId) return `Carrito ${cartId} no encontrado`;
        let productsXId = await prodAll.exist (prodId);
        if (!productsXId) return `Producto ${prodId} no encontrado`;
        let allCarts = await this.readCarts();
        let undeletedCarts = allCarts.filter(cart => cart.id != cartId);
        if (cartsXId.products.some((prod) => prod.id === prodId )){
            let addProdInCart = cartsXId.products.find((prod) => prod.id ===prodId);
            addProdInCart.quantity++;
            let cartsToSave = [cartsXId, ...undeletedCarts];
            await this.writeCarts(cartsToSave);
            return `Producto ${prodId} Agregado al Carrito ${cartId}`};
        cartsXId.products.push({id:productsXId.id,quantity:1})
        let cartsToSave = [cartsXId,...undeletedCarts];
        await this.writeCarts(cartsToSave);
        return `Producto ${prodId} Agregado al Carrito ${cartId}`;
    }
}
export default CartManager