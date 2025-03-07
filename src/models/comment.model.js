const db = require("../config/db");

const CommentModel = {
  /** GET */
  // findAll: async () => {
  //   try {
  //     const [results] = await db
  //       .promise()
  //       .query(
  //         `SELECT * FROM comments WHERE deleted_at IS NULL AND publish = TRUE`
  //       );

  //     return results;
  //   } catch (error) {
  //     console.log(error);
  //     throw new Error(error);
  //   }
  // },

  searchAndPagination: async (
    keyword,
    username,
    date,
    status,
    page,
    itemPerPage
  ) => {
    const offset = (page - 1) * itemPerPage;

    console.log(keyword);
    console.log(username);
    console.log(date);
    console.log(status);
    console.log(page);

    try {
      const [total] = await db
        .promise()
        .query(
          `SELECT COUNT(*) FROM comments ` +
            `WHERE deleted_at IS NULL AND ` +
            `publish = ? AND ` +
            `content LIKE ? AND ` +
            `username LIKE ? ` +
            `AND created_at BETWEEN ? AND CURDATE() `,
          [status, `%${keyword}%`, `%${username}%`, date]
        );

      const [data] = await db
        .promise()
        .query(
          `SELECT * FROM comments ` +
            `WHERE deleted_at IS NULL AND ` +
            `publish = ? AND ` +
            `content LIKE ? AND ` +
            `username LIKE ? ` +
            `AND created_at BETWEEN ? AND CURDATE() ` +
            `ORDER BY created_at DESC ` +
            `LIMIT ? OFFSET ?`,
          [status, `%${keyword}%`, `%${username}%`, date, itemPerPage, offset]
        );

      return { total: total[0]["COUNT(*)"], commentList: data };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  },

  findAllByDomain: async (domain) => {
    try {
      const [results] = await db
        .promise()
        .query(
          "SELECT * FROM comments WHERE domain = ? AND deleted_at IS NULL AND publish = TRUE",
          [domain]
        );
      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  findAllPublished: async () => {
    try {
      const [results] = await db
        .promise()
        .query("SELECT * FROM comments WHERE publish = TRUE");

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  findAllUnPublished: async () => {
    try {
      const [results] = await db
        .promise()
        .query("SELECT * FROM comments WHERE publish = FALSE");

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  findLatest: async () => {
    try {
      const [results] = await db
        .promise()
        .query("SELECT * FROM comments ORDER BY cid DESC LIMIT 1");

      return results[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  findById: async (cid) => {
    try {
      const [results] = await db
        .promise()
        .query("SELECT * FROM comments WHERE cid = ?", [cid]);

      console.log("results: ", results);

      return results[0];
    } catch (error) {
      throw new Error(error);
    }
  },

  findAllReplies: async (cid) => {
    try {
      const [results] = await db
        .promise()
        .query("SELECT * FROM comments WHERE pid = ?", [cid]);

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  /** PUT */
  publish: async (cid) => {
    try {
      const [results] = await db
        .promise()
        .query("UPDATE comments SET publish = TRUE WHERE cid = ?", [cid]);

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  unpublish: async (cid) => {
    try {
      const [results] = await db
        .promise()
        .query("UPDATE comments SET publish = FALSE WHERE cid = ?", [cid]);

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  update: async (commentUpdate) => {
    const { cid, username, email, content, domain } = commentUpdate;

    try {
      const [results] = await db
        .promise()
        .query(
          "UPDATE comments SET username = ?, email = ?, content = ?, domain = ?, publish = TRUE WHERE cid = ?",
          [username, email, content, domain, cid]
        );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  /** POST */
  save: async (newComment) => {
    const {
      nid,
      content,
      createdAt = new Date(),
      caid,
      domain = "vov.vn",
      username,
    } = newComment;

    try {
      const [results] = await db
        .promise()
        .query(
          "INSERT INTO comments (nid, content, created_at, caid, domain, username)" +
            "VALUES (?, ?, ?, ?, ?, ?)",
          [nid, content, createdAt, caid, domain, username]
        );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  reply: async (replyComment) => {
    const {
      cid: pid,
      uid,
      nid,
      content,
      username,
      userAvatar,
      email,
      domain,
    } = replyComment;
    try {
      const [results] = await db
        .promise()
        .query(
          "INSERT INTO comments (uid, nid, pid, content, username, user_avatar, email, domain)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [uid, nid, pid, content, username, userAvatar, email, domain]
        );

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  /** DELETE */
  remove: async (cid) => {
    try {
      const [results] = await db
        .promise()
        .query("DELETE FROM comments WHERE cid = ?", [cid]);

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },

  softRemove: async (cid) => {
    try {
      const [results] = await db
        .promise()
        .query("UPDATE comments SET deleted_at = NOW() WHERE cid = ?", [cid]);

      return results;
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = CommentModel;
