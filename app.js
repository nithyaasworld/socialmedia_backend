require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

//importing routes
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

let validateRequest = (req, res, next) => {
  let authHeader = req.headers['authorization'];
  console.log(authHeader);
  if(!req.headers['authorization']){
      res.status(403).send('No Authorization provided');
      return;
  }
  if(req.headers['authorization'].length < 8){
      res.status(403).send('Token not provided');
      return;
  }
  try{
      let data = jwt.verify(authHeader.split(' ')[1], process.env.ACCESS_TOKEN_SECRET);
      console.log("jwt verification result: ", data);
      next();
  } catch (err) {
    console.log(err);
      res.status(403).send("Invalid token provided");
  }
}

app.use('/auth', authRouter);
app.use("/user", userRouter);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to mongoose"))
  .catch((err) => console.log(err));

app.all(/.*/, (req, res) => {
  res.statusCode = 404;
  res.send("404 - Page not found");
});

const PORT = 8100;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
