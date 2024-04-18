const express = require("express");
const router = express.Router();
const categoriesController = require("../../../controllers/categoriesController");

router.post("/", categoriesController.addCategory);

module.exports = router;
