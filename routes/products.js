const router = require("express").Router();
const Product = require("../models/products");
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(404).json(err);

    }
});

module.exports = router;
