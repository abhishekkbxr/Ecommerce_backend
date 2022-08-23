const express = require('express');
const router = express.Router();
const {createProduct, getAllProducts, updateProduct, deleteProduct, getProductDetails ,createProductReview ,getProductReviews ,deleteReview} = require('../controller/productController');
const { isAuthenticatedUser ,authorizeRoles } = require('../middleware/auth');

// Product Routes 

router.route("/products").get( getAllProducts);
router.route("/admin/product/new").post( isAuthenticatedUser ,authorizeRoles("admin"), createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser ,authorizeRoles("admin"),updateProduct).delete(isAuthenticatedUser ,authorizeRoles("admin"),deleteProduct)
router.route("/product/:id").get(getProductDetails);

// Reviews Routes 
router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReview);




module.exports=router