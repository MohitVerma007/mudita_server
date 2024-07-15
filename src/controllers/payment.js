const db = require("../../db.js");

// Create a payment
exports.createPayment = async (req, res) => {
  const { payment_id, amount, status = 'pending', mentee_id, slot_id } = req.body;

  try {
    const query = `
      INSERT INTO payment (payment_id, amount, status, mentee_id, slot_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [payment_id, amount, status, mentee_id, slot_id]);

    const createdPayment = rows[0];
    return res.status(201).json({
      success: true,
      data: createdPayment,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all payments with pagination
exports.getAllPayments = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM payment";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM payment LIMIT $1 OFFSET $2";
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

// Get payments by mentee_id
exports.getPaymentsByMenteeId = async (req, res) => {
  const menteeId = req.params.id;

  try {
    const query = "SELECT * FROM payment WHERE mentee_id = $1";
    const { rows } = await db.query(query, [menteeId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Payments not found",
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

// Update a payment by id
exports.updatePaymentById = async (req, res) => {
  const paymentId = req.params.id;
  const { payment_id, amount, status, mentee_id, slot_id } = req.body;

  try {
    const query = `
      UPDATE payment
      SET payment_id = $1, amount = $2, status = $3, mentee_id = $4, slot_id = $5
      WHERE id = $6
      RETURNING *;
    `;
    const { rows } = await db.query(query, [payment_id, amount, status, mentee_id, slot_id, paymentId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    const updatedPayment = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedPayment,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete a payment by id
exports.deletePaymentById = async (req, res) => {
  const paymentId = req.params.id;

  try {
    const query = "DELETE FROM payment WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [paymentId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Payment not found",
      });
    }

    const deletedPayment = rows[0];
    return res.status(200).json({
      success: true,
      message: "Payment successfully deleted",
      data: deletedPayment,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
