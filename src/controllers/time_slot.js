const db = require("../../db.js");

// Create a time slot
exports.createTimeSlot = async (req, res) => {
  const { slot_start, slot_end, day, mentor_id } = req.body;

  try {
    const query = `
      INSERT INTO time_slots (slot_start, slot_end, day, mentor_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [slot_start, slot_end, day, mentor_id]);

    const createdTimeSlot = rows[0];
    return res.status(201).json({
      success: true,
      data: createdTimeSlot,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all time slots with pagination
exports.getAllTimeSlots = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM time_slots";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM time_slots LIMIT $1 OFFSET $2";
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

// Get time slots by mentor_id
exports.getTimeSlotsByMentorId = async (req, res) => {
  const mentorId = req.params.id;

  try {
    const query = "SELECT * FROM time_slots WHERE mentor_id = $1";
    const { rows } = await db.query(query, [mentorId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Time slots not found",
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

// Update a time slot by id
exports.updateTimeSlotById = async (req, res) => {
  const timeSlotId = req.params.id;
  const { slot_start, slot_end, day, mentor_id } = req.body;

  try {
    const query = `
      UPDATE time_slots
      SET slot_start = $1, slot_end = $2, day = $3, mentor_id = $4
      WHERE slot_id = $5
      RETURNING *;
    `;
    const { rows } = await db.query(query, [slot_start, slot_end, day, mentor_id, timeSlotId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Time slot not found",
      });
    }

    const updatedTimeSlot = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedTimeSlot,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete a time slot by id
exports.deleteTimeSlotById = async (req, res) => {
  const timeSlotId = req.params.id;

  try {
    const query = "DELETE FROM time_slots WHERE slot_id = $1 RETURNING *";
    const { rows } = await db.query(query, [timeSlotId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Time slot not found",
      });
    }

    const deletedTimeSlot = rows[0];
    return res.status(200).json({
      success: true,
      message: "Time slot successfully deleted",
      data: deletedTimeSlot,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
