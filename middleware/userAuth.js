const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    return res.status(401).json("Access Denied , Unauthenticated!");
  }
  try {
    const payLoad = jwt.verify(token, process.env.SEC_KEY);
    req.user = payLoad;
    next();
  } catch (error) {
    res.status(404).json("Unknown Error !");
  }
};
const verifyTokenAndAuthorization = (req, res, next) => {
  userAuth(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed !");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  userAuth(req, res, () => {
    if (req.user.isAdmin) {
      console.log(req.user.isAdmin);
      next();
    } else {
      res.status(403).json("You are not allowed admin only !");
    }
  });
};
module.exports = { userAuth, verifyTokenAndAuthorization, verifyTokenAndAdmin };
