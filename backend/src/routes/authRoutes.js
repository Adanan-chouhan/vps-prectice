const express = require("express");

const router = express.Router();

const { registerUser, loginUser, forgotPassword, refreshToken, updateProduct, deleteProduct, getProducts, createProduct } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/refresh-token", refreshToken);


// products
router.post("/product", createProduct);
router.get("/product", getProducts);
router.delete("/product/:id", deleteProduct);
router.patch("/product/:id", updateProduct);

module.exports = router;