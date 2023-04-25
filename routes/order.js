const router = require("express").Router();
const Order = require("../models/order");


router.get("/", async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(404).json(err);

    }
});

module.exports = router;
