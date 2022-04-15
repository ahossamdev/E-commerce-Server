const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");
const {
  register,
  login,
  update,
  remove,
  find,
  findOne,
} = require("../controller/user");

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/userAuth");


router.post("/register", async (req, res) => {
  const user = req.body;
  try {
    const savedUser = await register(user);
    if (savedUser.password) {
      const { password, ...others } = savedUser._doc;
      res.status(200).json(others);
    } else {
      res.status(400).json(savedUser);
    }
  } catch (err) {
    res.status(404).json(err);
  }
});

router.post("/login", async (req, res) => {
  const user = req.body;
  try {
    const token = await login(user);
    res.status(200).json(token);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.patch("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const userId = req.params.id;
  const newData = req.body;
  const savedUser = await User.findById(userId);
  const verifyPassword = bcrypt.compareSync(
    req.body.password,
    savedUser.password
  );
  const HASHED_PASSWORD = bcrypt.hashSync(req.body.password, 10);
  req.body.password = HASHED_PASSWORD;

  if (!savedUser) {
    return res.status(500).json("UNAUTHANTICATED !");
  } else if (req.body.password && verifyPassword) {
    try {
      const updatedUser = await update(req.params.id, newData);
      res
        .status(200)
        .json({ updatedUser, message: "User updated seccessfully !" });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(500).json("UNAUTHORIZED !");
  }
});

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await find({}, { password: 0 }).sort({ _id: -1 }).limit(5)
      : await find({}, { password: 0 });
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (!req.params.id) {
    res.status(404).json("User not found !");
  }
  try {
    const user = await findOne({}, { password: 0 });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get("/status", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const users = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month" }, total: { $sum: 1 } },
    ]);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const userId = req.params.id;
  try {
    await remove(userId);
    res.status(200).json("User deleted successfully!");
  } catch (err) {
    res.status(404).json(err);
  }
});

module.exports = router;
