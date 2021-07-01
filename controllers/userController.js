const UserModel = require("../models/user");
const bcrypt = require("bcrypt");

const addUser = async ({username, name, email, password }) => {
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

const addRefreshToken = async ({ email, refresh_token }) => {
    console.log("add refresh token function called");
    console.log('received email and refresh token', email, refresh_token);
    await UserModel.updateOne({ email }, { $addToSet: { refresh_token: [refresh_token] } })
    //     .then((res) => {
    //  })
}
const checkRefreshToken = async ({ email, refresh_token }) => {
    console.log("check refresh token function called");
    console.log('received email and refresh token', email, refresh_token);
    let result = {};
    await UserModel.findOne({ email }).then((res) => {
        if (res) {
            result = { status: true }
        } else {
            result = { status: false }
        }
    })
    return result;
}
const deleteAllRefreshToken = async ({ email, refresh_token }) => {
    console.log("Delete refresh token function called");
    console.log('received email and refresh token', email, refresh_token);
    await UserModel.findOneAndUpdate({ email }, { refresh_token: [] }, { new: true }).then((res) => {
        console.log("user record after deleting all refresh tokens: ",res);
    })
}
module.exports = {
  addUser,
    loginUser,
    addRefreshToken,
    checkRefreshToken,
    deleteAllRefreshToken
};
