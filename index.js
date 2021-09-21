const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

// set up server
// function to return an object
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://snippet-manager-code.herokuapp.com"],
    credentials: true
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
// here we change 5000 to PORT
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


// set up routers
app.use("/snippet", require("./routers/snippetRouter"));
app.use("/auth", require('./routers/userRouter'));

// connect to MONGODB
mongoose.connect(process.env.MDB_CONNECT_STRING, (err) => {
  if (err) return console.log(err);
  console.log("Connected to MongoDB");
});
