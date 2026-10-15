require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/", (req, res) => res.send("API running"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/task"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => console.log("Server on " + process.env.PORT));
  })
  .catch((err) => console.log(err));