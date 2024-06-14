const db = require("../../db.js");

exports.createComment = async (req, res) => {
  const { description, insta_id, user_id } = req.body;

  try {
    const query = `
        INSERT INTO comment (description, insta_id, user_id)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
    const { rows } = await db.query(query, [description, insta_id, user_id]);

    const createdComment = rows[0];
    return res.status(201).json({
      success: true,
      data: createdComment,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.getAllComments = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM comment";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM comment LIMIT $1 OFFSET $2";
    const { rows } = await db.query(query, [limit, offset]);

    const response = {
      success: true,
      pagination: {
        page,
        limit,
        totalCount,
      },
      data: rows,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.getCommentById = async (req, res) => {
  const commentId = req.params.id;

  try {
    const query = "SELECT * FROM comment WHERE id = $1";
    const { rows } = await db.query(query, [commentId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    const comment = rows[0];
    return res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateCommentById = async (req, res) => {
  const commentId = req.params.id;
  const { description } = req.body;

  try {
    const query = `
        UPDATE comment
        SET description = $1
        WHERE id = $2
        RETURNING *;
      `;

    const { rows } = await db.query(query, [description, commentId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    const updatedComment = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedComment,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteCommentById = async (req, res) => {
  const commentId = req.params.id;

  try {
    const query = "DELETE FROM comment WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [commentId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Comment not found",
      });
    }

    const deletedComment = rows[0];
    return res.status(200).json({
      success: true,
      is_deleted: "Successfully deleted!",
      data: deletedComment,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
