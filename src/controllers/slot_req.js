const db = require("../../db.js");

// Create a slot request
exports.createSlotRequest = async (req, res) => {
  const { slot_id, mentor_id, mentee_id } = req.body;

  try {
    const query = `
      INSERT INTO slot_request (slot_id, mentee_id, mentor_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [slot_id, mentee_id, mentor_id]);

    const createdSlotRequest = rows[0];
    return res.status(201).json({
      success: true,
      data: createdSlotRequest,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all slot requests with pagination
exports.getAllSlotRequests = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM slot_request";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM slot_request LIMIT $1 OFFSET $2";
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

// Get slot requests by mentor_id
exports.getSlotRequestsByMentorId = async (req, res) => {
  const reqId = req.params.id;

  try {
    const query = "SELECT * FROM slot_request WHERE req_id = $1";
    const { rows } = await db.query(query, [reqId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Slot requests not found",
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

// Update a slot request status by id
exports.updateSlotRequestStatusById = async (req, res) => {
  const slotRequestId = req.params.id;
  const { status } = req.body;

  if (!['pending', 'rejected', 'approved'].includes(status)) {
    return res.status(400).json({
      error: "Invalid status value",
    });
  }

  try {
    const query = `
      UPDATE slot_request
      SET status = $1
      WHERE req_id = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [status, slotRequestId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Slot request not found",
      });
    }

    const updatedSlotRequest = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedSlotRequest,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete a slot request by id
exports.deleteSlotRequestById = async (req, res) => {
  const slotRequestId = req.params.id;

  try {
    const query = "DELETE FROM slot_request WHERE req_id = $1 RETURNING *";
    const { rows } = await db.query(query, [slotRequestId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Slot request not found",
      });
    }

    const deletedSlotRequest = rows[0];
    return res.status(200).json({
      success: true,
      message: "Slot request successfully deleted",
      data: deletedSlotRequest,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
