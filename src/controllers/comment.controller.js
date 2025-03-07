const CommentModel = require("../models/comment.model");
const CommentHistoryModel = require("../models/commentHistory.model");
const SolrHandler = require("../utils/solrHandler");

const {
  isNumber,
  isNullOrUndefined,
  isDateValid,
  isNull,
} = require("../utils/validation");
const {
  handleResponseSuccess,
  handleResponseFailure,
} = require("../utils/handleResponse");
const { formatDate } = require("../utils/dateUtils");

/** GET */
// exports.getAllComments = async (req, res) => {
//   try {
//     const dataRes = await CommentModel.findAll();

//     return handleResponseSuccess(
//       res,
//       200,
//       "Data retrieved successfully",
//       dataRes
//     );
//   } catch (error) {
//     return handleResponseFailure(res, 500, "Internal Server Error");
//   }
// };

exports.getAllComments = async (req, res) => {
  let {
    status = 1,
    page = 1,
    itemPerPage = 50,
    keyword = "",
    username = "",
    date = new Date(),
  } = req.query;

  // page parameter is required must be numbers
  if (!isNumber(Number(page))) {
    return handleResponseFailure(
      res,
      400,
      "Bad Request: Invalid parameters! page parameter is required and must be numbers!"
    );
  }

  // keyword and username parameters are required and must be not null or undefined
  // if (isNullOrUndefined(keyword) || isNullOrUndefined(username)) {
  //   return handleResponseFailure(
  //     res,
  //     400,
  //     "Bad Request: Invalid parameters! keyword and username parameters must be not null or undefined!"
  //   );
  // }

  // The date parameter must be a valid date
  // if (!isDateValid(new Date(date))) {
  //   return handleResponseFailure(
  //     res,
  //     400,
  //     "Bad Request: Invalid parameters! The date parameter is invalid!"
  //   );
  // }

  try {
    const dataRes = await CommentModel.searchAndPagination(
      keyword,
      username,
      formatDate(date),
      Boolean(Number(status)),
      Number(page),
      Number(itemPerPage)
    );

    console.log("dataRes: ", dataRes);

    return handleResponseSuccess(
      res,
      200,
      "Data retrieved successfully",
      dataRes
    );
  } catch (error) {
    console.log(error);
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

exports.getAllPublishedComments = async (req, res) => {
  try {
    const dataRes = await CommentModel.findAllPublished();

    return handleResponseSuccess(
      res,
      200,
      "Data retrieved successfully",
      dataRes
    );
  } catch (error) {
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

exports.getAllUnPublishedComments = async (req, res) => {
  try {
    const dataRes = await CommentModel.findAllUnPublished();

    return handleResponseSuccess(
      res,
      200,
      "Data retrieved successfully",
      dataRes
    );
  } catch (error) {
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

exports.getLatestComment = async (req, res) => {
  try {
    const dataRes = await CommentModel.findLatest();

    return handleResponseSuccess(
      res,
      200,
      "Data retrieved successfully",
      dataRes
    );
  } catch (error) {
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

exports.getCommentById = async (req, res) => {
  const { cid } = req.params;
  try {
    const dataRes = await CommentModel.findById(cid);

    return handleResponseSuccess(
      res,
      200,
      "Data retrieved successfully",
      dataRes
    );
  } catch (error) {
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

exports.getAllReplies = async (req, res) => {
  const { cid } = req.params;
  try {
    const dataRes = await CommentModel.findAllReplies(cid);

    return handleResponseSuccess(
      res,
      200,
      "Data retrieved successfully",
      dataRes
    );
  } catch (error) {
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

/** PUT */
exports.publishComment = async (req, res) => {
  const { cid } = req.params;
  try {
    await CommentModel.publish(cid);

    return handleResponseSuccess(
      res,
      200,
      "The record has been successfully updated!"
    );
  } catch (error) {
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

exports.unpublishComment = async (req, res) => {
  const { cid } = req.params;
  try {
    await CommentModel.unpublish(cid);

    return handleResponseSuccess(
      res,
      200,
      "The record has been successfully updated!"
    );
  } catch (error) {
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

exports.updateComment = async (req, res) => {
  const commentUpdate = req.body;

  try {
    const commentOnDB = await CommentModel.findById(commentUpdate.cid);

    if (!commentOnDB) {
      return handleResponseSuccess(res, 404, "Record not found!");
    }

    const newCmtHistory = {
      cid: commentOnDB.cid,
      uid: commentOnDB.uid,
      oldContent: commentOnDB.content,
      newContent: commentUpdate.content,
      updatedAt: new Date(),
      isDeleted: commentOnDB.deleted_at ? true : false,
    };

    await CommentModel.update(commentUpdate);

    await CommentHistoryModel.create(newCmtHistory);

    return handleResponseSuccess(
      res,
      200,
      "The record has been successfully updated!"
    );
  } catch (error) {
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

/** POST */
exports.createComment = async (req, res) => {
  const newComment = req.body;

  try {
    const { its_field_category } = await SolrHandler.callSolr(newComment.nid);
    newComment.caid = its_field_category;

    await CommentModel.save(newComment);

    return handleResponseSuccess(
      res,
      200,
      "The record has been successfully created!"
    );
  } catch (error) {
    console.log("error: ", error);
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

exports.replyComment = async (req, res) => {
  const replyComment = req.body;

  try {
    await CommentModel.reply(replyComment);

    return handleResponseSuccess(
      res,
      200,
      "The record has been successfully created!"
    );
  } catch (error) {
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

/** DELETE */
exports.deleteComment = async (req, res) => {
  const { cid } = req.params;
  try {
    const commentOnDB = await CommentModel.findById(cid);
    if (!commentOnDB) {
      return handleResponseSuccess(res, 404, "Record not found!");
    }

    await CommentModel.remove(cid);

    return handleResponseSuccess(
      res,
      200,
      "The record has been successfully deleted!"
    );
  } catch (error) {
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};

exports.softDeleteComment = async (req, res) => {
  let { cid } = req.params;

  try {
    const commentOnDB = await CommentModel.findById(cid);

    console.log("commentOnDB: ", commentOnDB);

    if (!commentOnDB || !isNull(commentOnDB.deleted_at)) {
      return handleResponseSuccess(res, 404, "Record not found!");
    }

    await CommentModel.softRemove(cid);

    const { uid, content } = commentOnDB;
    const newCmtHistory = {
      cid,
      uid,
      oldContent: content,
      updatedAt: new Date(),
      status: -1,
    };

    await CommentHistoryModel.create(newCmtHistory);

    return handleResponseSuccess(
      res,
      200,
      "The record has been successfully deleted!"
    );
  } catch (error) {
    console.log(error);
    return handleResponseFailure(res, 500, "Internal Server Error");
  }
};
