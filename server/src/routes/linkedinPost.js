const express = require("express");
const router = express.Router();
const { generateLinkedInPost } = require("../controller/linkedinPost");


router.get("/data", generateLinkedInPost);

module.exports = router;
