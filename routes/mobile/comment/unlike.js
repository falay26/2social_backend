const express = require("express");
const router = express.Router();
const postsController = require("../../../controllers/postsController");

router.post("/", postsController.unlikeComment);

module.exports = router;
