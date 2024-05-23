const db = require("../../db.js");

// Create a new session
exports.menteeReq = async (req, res) => {
  const { mentee_id, mentor_id, mentee_text } = req.body;

  try {
    const query = `
      INSERT INTO session (mentee_id, mentor_id, status, mentee_text, is_completed, created_date)
      VALUES ($1, $2, 'pending', $3, FALSE, CURRENT_TIMESTAMP)
      RETURNING *;
    `;

    const { rows } = await db.query(query, [mentee_id, mentor_id, mentee_text]);

    const createdSession = rows[0];
    return res.status(201).json({
      success: true,
      data: createdSession,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all sessions
exports.getAllSessions = async (req, res) => {
  try {
    const query = "SELECT * FROM session";
    const { rows } = await db.query(query);
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

// Get session by ID
exports.getSessionById = async (req, res) => {
  const sessionId = req.params.id;

  try {
    const query = "SELECT * FROM session WHERE session_id = $1";
    const { rows } = await db.query(query, [sessionId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const session = rows[0];
    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update session by ID
exports.mentorReqById = async (req, res) => {
  const sessionId = req.params.id;
  const { status, meet_link, mentor_text } = req.body;

  try {
    const query = `
      UPDATE session
      SET status = $1, meet_link = $2, mentor_text = $3
      WHERE session_id = $4
      RETURNING *;
    `;

    const { rows } = await db.query(query, [
      status,
      meet_link,
      mentor_text,
      sessionId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const updatedSession = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.completeSession = async (req, res) => {
  const sessionId = req.params.id;
  const { is_completed } = req.body;

  try {
    const query = `
    UPDATE session
    SET is_completed = $1
    WHERE session_id = $2 AND status = 'approved'
    RETURNING *;
  `;
    const { rows } = await db.query(query, [is_completed, sessionId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const updatedSession = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete session by ID
exports.deleteSessionById = async (req, res) => {
  const sessionId = req.params.id;

  try {
    const query = "DELETE FROM session WHERE session_id = $1 RETURNING *";
    const { rows } = await db.query(query, [sessionId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const deletedSession = rows[0];
    return res.status(200).json({
      success: true,
      is_deleted: "Successfully deleted!",
      data: deletedSession,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
