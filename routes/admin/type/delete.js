const express = require("express");
const router = express.Router();
const typesController = require("../../../controllers/typesController");

router.post("/", typesController.deleteType);

module.exports = router;
