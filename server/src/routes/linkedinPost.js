const express = require("express");
const router = express.Router();
const { generateLinkedInPost } = require("../controller/linkedinPost");


router.post("/data", generateLinkedInPost);

module.exports = router;
