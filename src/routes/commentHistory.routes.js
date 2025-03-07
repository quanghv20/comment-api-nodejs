const express = require("express");
const router = express.Router();

/** CONTROLLER */
const CommentHistoryController = require("../controllers/commentHistory.controller");

/** GET */
router.get("/:cid", CommentHistoryController.getAllCmtHistoryByCid);

module.exports = router;
