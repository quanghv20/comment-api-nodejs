const express = require("express");
const router = express.Router();

/** CONTROLLER */
const CommentController = require("../controllers/comment.controller");

/** GET */
router.get("/", CommentController.getAllComments);
// router.get("/search-and-pagination", CommentController.searchAndPagination);
router.get("/publish", CommentController.getAllPublishedComments);
router.get("/unpublish", CommentController.getAllUnPublishedComments);
router.get("/latest", CommentController.getLatestComment);
router.get("/:cid", CommentController.getCommentById);
router.get("/replies/:cid", CommentController.getAllReplies);

/** PUT */
router.put("/", CommentController.updateComment);
router.put("/publish/:cid", CommentController.publishComment);
router.put("/unpublish/:cid", CommentController.unpublishComment);
router.put("/delete/:cid", CommentController.softDeleteComment);

/** POST */
router.post("/", CommentController.createComment);
router.post("/replyComment", CommentController.replyComment);

/** DELETE */
// router.delete("/delete/:cid", CommentController.deleteComment);

module.exports = router;
