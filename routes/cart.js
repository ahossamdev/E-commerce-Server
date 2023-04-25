const router = require("express").Router();
const Cart = require("../models/cart");

router.get("/", (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(404).json(err);

    }
});

module.exports = router;
