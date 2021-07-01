require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

//importing routes
const authRouter = require('./routes/auth');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
// app.use("/posts", postRouter);

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
