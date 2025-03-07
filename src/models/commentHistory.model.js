const db = require("../config/db");

/**
 * STATUS
 * -1: deleted
 *  0: unpublish
 *  1: publish
 *  2: updated
 */
const CommentHistoryModel = {
  /** GET */
  findAll: async () => {
    try {
      const [results] = await db
        .promise()
        .query("SELECT * FROM comments_history");

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  findByCid: async (cid) => {
    try {
      const [results] = await db
        .promise()
        .query("SELECT * FROM comments_history WHERE cid = ?", [cid]);

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  /** POST */
  create: async (newCmtHistory) => {
    const { cid, uid, oldContent, newContent, updatedAt, status } =
      newCmtHistory;

    console.log("newCmtHistory: ", newCmtHistory);
    try {
      try {
        const [results] = await db
          .promise()
          .query(
            "INSERT INTO comments_history (cid, uid, old_content, new_content, updated_at, status)" +
              "VALUES (?, ?, ?, ?, ?, ?)",
            [cid, uid, oldContent, newContent, updatedAt, status]
          );

        return results;
      } catch (error) {
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = CommentHistoryModel;
