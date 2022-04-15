const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const register = async (user) => {
  const { email } = user;
  const { username } = user;

  const isExistEmail = await User.findOne({ email });
  const isExistUsername = await User.findOne({ username });
  console.log(isExistEmail);
  console.log(isExistUsername);

  if (isExistEmail) {
    return { message: "email already exist !" };
  }
  if (isExistUsername) {
    return { message: "username already exist !" };
  } else {
    return User.create(user);
  }
};

const login = async (user) => {
  const { email } = user;
  const userPassword = user.password;
  const userSaved = await User.findOne({ email });
  if (!userSaved) {
    return { mesage: "invalid email or password !" };
  }
  const validPassword = bcrypt.compareSync(userPassword, userSaved.password);
  if (!validPassword) {
    return { message: "invalid email or password !" };
  }
  const token = jwt.sign(
    {
      _id: userSaved._id,
      isAdmin: userSaved.isAdmin,
    },
    process.env.SEC_KEY,
    { expiresIn: "2d" }
  );
  const { password, ...userInfo } = userSaved._doc;

  return { token, ...userInfo };
};

const update = (userId, newData) => {
  return User.findByIdAndUpdate(
    userId,
    { $set: newData },
    {
      new: true,
      runValidators: true,
    }
  );
};

const remove = async (userId) => {
  await User.findOneAndDelete(userId);
};
const find = (query, projection) => {
  return User.find(query, projection);
};
const findOne = (userId, projection) => {
  return User.findOne(userId, projection);
};
module.exports = { register, login, update, remove, find,findOne };
