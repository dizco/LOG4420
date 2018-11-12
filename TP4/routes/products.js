const express = require("express");
const router = express.Router();

//Get all products
router.get("/", (req, res) => {
  res.json({});
});

//Get product by id
router.get("/:id", (req, res) => {
  res.json({});
});

//Create new product
router.post("/", (req, res) => {
  res.json({});
});

//Delete product by id
router.delete("/:id", (req, res) => {
  res.json({});
});

//Delete all products
router.get("/", (req, res) => {
  res.json({});
});

module.exports = router;
