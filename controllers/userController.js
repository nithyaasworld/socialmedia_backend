const UserModel = require("../models/user");
const bcrypt = require("bcrypt");

//Auth related functions
const addUser = async ({ username, name, email, password }) => {
  let hash = await bcrypt.hash(password, 10);
  let user = new UserModel({ username, name, email, password: hash });
  let result = {};
  await user
    .save()
    .then((res) => {
      result["status"] = true;
      result["user"] = res;
    })
    .catch((err) => {
      result["status"] = false;
      result["err"] = err;
    });
  return result;
};
const loginUser = async ({ email, password }) => {
  try {
    console.log("email is: ", email);
    let user = await UserModel.findOne({ email });
    console.log("user is: ", user);
    if (user === null) {
      return { status: false, result: { message: "Invalid Email" } };
    }
    console.log(user);
    let result = await bcrypt.compare(password, user.password);
    if (!result) {
      return { status: false, result: { message: "Invalid Password" } };
    }
    return { status: true, result: user };
  } catch (error) {
    return { status: false, result: { message: "Error: " + error.message } };
  }
};

//Token related functions
const addRefreshToken = async ({ email, refresh_token }) => {
  console.log("add refresh token function called");
  console.log("received email and refresh token", email, refresh_token);
  await UserModel.updateOne(
    { email },
    { $addToSet: { refresh_token: [refresh_token] } }
  );
};
const checkRefreshToken = async ({ email, refresh_token }) => {
  console.log("check refresh token function called");
  console.log("received email and refresh token", email, refresh_token);
  let result = {};
  await UserModel.findOne({ email }).then((res) => {
    if (res) {
      result = { status: true };
    } else {
      result = { status: false };
    }
  });
  return result;
};
const deleteAllRefreshToken = async ({ email, refresh_token }) => {
  console.log("Delete refresh token function called");
  console.log("received email and refresh token", email, refresh_token);
  await UserModel.findOneAndUpdate(
    { email },
    { refresh_token: [] },
    { new: true }
  ).then((res) => {
    console.log("user record after deleting all refresh tokens: ", res);
  });
};

//follow unfollow - related functions
const followUser = async (email, userToFollow) => {
  let idOfUserToFollow;
  let idOfCurrUser;
  await UserModel.findOne({ username: userToFollow }).then(
    (data) => (idOfUserToFollow = data._id)
  );
  await UserModel.findOne({ email }).then((data) => (idOfCurrUser = data._id));
  await UserModel.updateOne(
    { email },
    { $addToSet: { i_follow: [idOfUserToFollow] } }
  ).then(async () => {
    await UserModel.updateOne(
      { username: userToFollow },
      { $addToSet: { my_followers: [idOfCurrUser] } }
    ).catch((e) => console.log(e));
  });
};
const unfollowUser = async (email, userToUnFollow) => {
  let idOfUserToUnFollow;
  let idOfCurrUser;
  await UserModel.findOne({ username: userToUnFollow }).then(
    (data) => (idOfUserToUnFollow = data._id)
  );
  await UserModel.findOne({ email }).then((data) => (idOfCurrUser = data._id));
  await UserModel.updateOne(
    { email },
    { $pull: { i_follow: {  $in: [idOfUserToUnFollow]  } } }
  ).then(async () => {
    await UserModel.updateOne(
      { username: userToUnFollow },
      { $pull: { my_followers: {  $in: [idOfCurrUser] }  } }
    );
  });
};

module.exports = {
  addUser,
  loginUser,
  addRefreshToken,
  checkRefreshToken,
  deleteAllRefreshToken,
  followUser,
  unfollowUser,
};
