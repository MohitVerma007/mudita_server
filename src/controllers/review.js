const db = require("../../db.js");

// Create a review entry
exports.createReview = async (req, res) => {
  const { mentor_id, user_id, rating, content } = req.body;

  try {
    const query = `
      INSERT INTO reviews (mentor_id, users_id, rating, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [mentor_id, user_id, rating, content]);

    const createdReview = rows[0];
    return res.status(201).json({
      success: true,
      data: createdReview,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all review entries with pagination
exports.getAllReviews = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM reviews";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM reviews LIMIT $1 OFFSET $2";
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

// Get a review entry by id
exports.getReviewById = async (req, res) => {
  const mentor_id = req.params.id;

  try {
    const query = "SELECT * FROM reviews WHERE mentor_id = $1";
    const { rows } = await db.query(query, [mentor_id]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Review not found",
      });
    }


    const avgRatingQuery = `
    SELECT AVG(rating) AS avg_rating
    FROM reviews
    WHERE mentor_id = $1
  `;
  const { rows: avgRows } = await db.query(avgRatingQuery, [mentor_id]);

  const avgRating = parseFloat(avgRows[0].avg_rating).toFixed(1);



    // const avg = rows.length /

    return res.status(200).json({
      success: true,
      data: rows,
      avg: avgRating,
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update a review entry by id
exports.updateReviewById = async (req, res) => {
  const reviewId = req.params.id;
  const { rating, content } = req.body;

  try {
    const query = `
      UPDATE reviews
      SET rating = $1, content = $2
      WHERE review_id = $3
      RETURNING *;
    `;
    const { rows } = await db.query(query, [rating, content, reviewId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Review not found",
      });
    }

    const updatedReview = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedReview,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete a review entry by id
exports.deleteReviewById = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const query = "DELETE FROM reviews WHERE review_id = $1 RETURNING *";
    const { rows } = await db.query(query, [reviewId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Review not found",
      });
    }

    const deletedReview = rows[0];
    return res.status(200).json({
      success: true,
      message: "Review successfully deleted",
      data: deletedReview,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
