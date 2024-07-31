const db = require("../../db.js");

// Create a fee entry
exports.createFee = async (req, res) => {
  const { amount } = req.body;

  try {
    const query = `
      INSERT INTO fees (amount)
      VALUES ($1)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [amount]);

    const createdFee = rows[0];
    return res.status(201).json({
      success: true,
      data: createdFee,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all fee entries with pagination
exports.getAllFees = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM fees";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM fees LIMIT $1 OFFSET $2";
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

// Get a fee entry by id
exports.getFeeById = async (req, res) => {
  const feeId = req.params.id;

  try {
    const query = "SELECT * FROM fees WHERE id = $1";
    const { rows } = await db.query(query, [feeId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Fee not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update a fee entry by id
exports.updateFeeById = async (req, res) => {
  const feeId = req.params.id;
  const { amount } = req.body;

  try {
    const query = `
      UPDATE fees
      SET amount = $1
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [amount, feeId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Fee not found",
      });
    }

    const updatedFee = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedFee,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete a fee entry by id
exports.deleteFeeById = async (req, res) => {
  const feeId = req.params.id;

  try {
    const query = "DELETE FROM fees WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [feeId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Fee not found",
      });
    }

    const deletedFee = rows[0];
    return res.status(200).json({
      success: true,
      message: "Fee successfully deleted",
      data: deletedFee,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
