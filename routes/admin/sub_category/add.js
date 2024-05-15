const express = require("express");
const router = express.Router();
const subCategoriesController = require("../../../controllers/subCategoriesController");

router.post("/", subCategoriesController.addCategory);

module.exports = router;
