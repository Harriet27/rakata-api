const express = require('express');
const router = express.Router();
const { productController } = require('../controller');
const { auth } = require('../helper/jwt');
const {
    getProduct,
    getProductLimit,
    addProduct,
    editProduct,
    deleteProduct,
    searchProduct,
} = productController;

router.get('/get-products', getProduct);
router.get('/get-limit/:limit/:offset', getProductLimit);
router.post('/add-products', addProduct);
router.patch('/edit-products/:id', editProduct);
router.delete('/delete-products/:id', deleteProduct);
router.get('/search-products/:product/:limit/:offset', searchProduct);

module.exports = router;
