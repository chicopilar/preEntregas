import {promises as fs} from 'fs'

class ProductManager {
    constructor(){
        this.path = "./src/products.json"
    }

    readProducts = async()=>{
        let products = await fs.readFile(this.path,"utf-8")
        return JSON.parse(products);
    };

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product));
    }

    exist = async (id)=>{
        console.log("id desde exist", id)
        let products = await this.readProducts()
        return products.find(prod => prod.id === id)
    }

    addProducts = async (product) => {
        let productsReaded = await this.readProducts();
        let nextId = productsReaded.length ? productsReaded[productsReaded.length -1].id +1:1;
        product.id = nextId;
        let allProducts = [...productsReaded , product];
        await this.writeProducts(allProducts);
        return "Producto Agregado";
    };
    
    getProducts = async()=>{
        return await this.readProducts()
    };

    getProductsXId = async(id) => {
        let productsXId = await this.exist(id)
        if (productsXId){return productsXId}
    };

    productUpdate = async (id, updatedProduct)=> {
        let productsXId = await this.exist(id)
        if (!productsXId) return "Producto no encontrado"
        await this.deleteProduct(id)
        let products = await this.readProducts()
        let update = [{...updatedProduct, id :id}, ...products]
        await this.writeProducts(update)
        return "Producto actualizado"
    }

    deleteProduct = async (id) =>{
        let productsXId = await this.exist(id)
        let products = await this.readProducts()
        if (productsXId){
            let undeleteProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(undeleteProducts)
            return "Producto eliminado"
        }
        return "El producto solicitado no existe"
    }

}
export default ProductManager
