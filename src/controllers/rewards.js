const db = require("../../db.js");

// Create a reward entry
exports.createReward = async (req, res) => {
  const { mentor_id, points, earning_rupees } = req.body;

  try {
    const query = `
      INSERT INTO rewards (mentor_id, points, earning_rupees)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [mentor_id, points, earning_rupees]);

    const createdReward = rows[0];
    return res.status(201).json({
      success: true,
      data: createdReward,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all reward entries with pagination
exports.getAllRewards = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM rewards";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM rewards LIMIT $1 OFFSET $2";
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

// Get reward entries by mentor_id
exports.getRewardsByMentorId = async (req, res) => {
  const mentorId = req.params.id;

  try {
    const query = "SELECT * FROM rewards WHERE mentor_id = $1";
    const { rows } = await db.query(query, [mentorId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Rewards not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update a reward entry by id
exports.updateRewardById = async (req, res) => {
  const rewardId = req.params.id;
  const { mentor_id, points, redeem, earning_rupees } = req.body;

  try {
    const query = `
      UPDATE rewards
      SET mentor_id = $1, points = $2, redeem = $3, earning_rupees = $4
      WHERE id = $5
      RETURNING *;
    `;
    const { rows } = await db.query(query, [mentor_id, points, redeem, earning_rupees, rewardId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Reward not found",
      });
    }

    const updatedReward = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedReward,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete a reward entry by id
exports.deleteRewardById = async (req, res) => {
  const rewardId = req.params.id;

  try {
    const query = "DELETE FROM rewards WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [rewardId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Reward not found",
      });
    }

    const deletedReward = rows[0];
    return res.status(200).json({
      success: true,
      message: "Reward successfully deleted",
      data: deletedReward,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
