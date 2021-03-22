const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // res.send("Hello world");
  res.render("index", { title: "My Epress App", message: "Hello" });
});

module.exports = router;
