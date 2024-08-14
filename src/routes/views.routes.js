import express from 'express';
import productModel from '../models/product.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
        const queryParts = query.split('=');
        if (queryParts.length === 2 && queryParts[0] === 'category') {
            filter.category = { $regex: queryParts[1], $options: 'i' };
        } else if (queryParts.length === 2 && queryParts[0] === 'status') {
            filter.status = queryParts[1] === 'true';
        }
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };
    try {
        const result = await productModel.paginate(filter, options);
        res.render('home',{
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;