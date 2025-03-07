const CommentHistoryModel = require("../models/commentHistory.model");

const db = require("../config/db");

const {
  handleResponseSuccess,
  handleResponseFailure,
} = require("../utils/handleResponse");

/** GET */

exports.getAllCmtHistoryByCid = async (req, res) => {
  const { cid } = req.params;

  try {
    const dataRes = await CommentHistoryModel.findByCid(cid);

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
