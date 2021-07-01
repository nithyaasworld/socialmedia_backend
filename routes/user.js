const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/follow/:userid", async (req, res) => {
    let  email = req.body.email;
    let userToFollow = req.params.userid;
  let result;
  await userController
    .followUser(email, userToFollow)
    .then((data) => (result = data))
    .catch((err) => (resul = err));
  res.send(result);
});
router.post("/unfollow/:userid", async (req, res) => {
    let email= req.body.email;
    let userToUnFollow = req.params.userid;
    let result;
    console.log("line 19: ",email, userToUnFollow);
    await userController
      .unfollowUser(email, userToUnFollow)
      .then((data) => (result = data))
      .catch((err) => (resul = err));
    res.send(result);
});
module.exports = router;