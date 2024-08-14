import { Router } from "express";
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

const configureCartsRouter = (data) => {
    const router = Router();

    router.post('/add/:pid', async (req, res) => {
        const productId = req.params.pid;
        const { quantity } = req.body;

        try {
            const product = await productModel.findById(productId);
            if (!product) {
                return res.status(404).json({ msg: 'Product not found' });
            }

            if (product.stock < quantity) {
                return res.status(400).json({ msg: 'Not enough stock' });
            }

            let cart = await cartModel.findOne();
            if (!cart) {
                cart = new cartModel({ products: [] });
            }

            const productInCart = cart.products.find(p => p.product.toString() === productId);
            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            product.stock -= quantity;
            await product.save();
            await cart.save();
            cart = await cart.populate('products.product');
            data.emit('cartUpdated', cart);
            data.emit('productUpdated', product);
            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    });

    router.get('/', async (req, res) => {
        try {
            const cart = await cartModel.findOne().populate('products.product');
            if (!cart) {
                return res.status(200).json({ products: [] });
            }
            res.json(cart.toObject());
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    });

    router.post('/remove/:pid', async (req, res) => {
        const productId = req.params.pid;
        const { quantity } = req.body;

        try {
            let cart = await cartModel.findOne();
            if (!cart) {
                return res.status(404).json({ msg: 'Cart not found' });
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex === -1) {
                return res.status(404).json({ msg: 'Product not found in cart' });
            }

            const productInCart = cart.products[productIndex];
            productInCart.quantity -= quantity;
            if (productInCart.quantity <= 0) {
                cart.products.splice(productIndex, 1);
            }

            const product = await productModel.findById(productId);
            if (product) {
                product.stock += quantity;
                await product.save();
            }

            await cart.save();
            cart = await cart.populate('products.product');
            data.emit('cartUpdated', cart); 
            data.emit('productUpdated', product);
            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    });

    router.post('/clear', async (req, res) => {
        try {
            let cart = await cartModel.findOne();
            if (!cart) {
                return res.status(404).json({ msg: 'Cart not found' });
            }
    
            for (const item of cart.products) {
                const product = await productModel.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                    data.emit('productUpdated', product);
                }
            }
            cart.products = [];
            await cart.save();
            data.emit('cartCleared'); 
            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    });
    return router;
};

export default configureCartsRouter;