const db = require("../../db.js");

exports.createToolkitReminder = async (req, res) => {
  const { user_id, reminder_message, reminder_time } = req.body;

  try {
    const query = `
        INSERT INTO ToolkitReminders (user_id, reminder_message, reminder_time)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

    const { rows } = await db.query(query, [
      user_id,
      reminder_message,
      reminder_time,
    ]);

    const createdReminder = rows[0];
    return res.status(201).json({
      success: true,
      data: createdReminder,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateToolkitReminder = async (req, res) => {
  const { user_id, reminder_message, reminder_time } = req.body;
  const reminderId = req.params.id; // Assuming you're passing the reminder ID in the URL

  try {
    const query = `
        UPDATE ToolkitReminders
        SET user_id = $1, reminder_message = $2, reminder_time = $3
        WHERE id = $4
        RETURNING *;
      `;

    const { rows } = await db.query(query, [
      user_id,
      reminder_message,
      reminder_time,
      reminderId,
    ]);

    const updatedReminder = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedReminder,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteToolkitReminder = async (req, res) => {
  const reminderId = req.params.id; // Assuming you're passing the reminder ID in the URL

  try {
    const query = `
        DELETE FROM ToolkitReminders
        WHERE id = $1
        RETURNING *;
      `;

    const { rows } = await db.query(query, [reminderId]);

    const deletedReminder = rows[0];
    return res.status(200).json({
      success: true,
      data: deletedReminder,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.getToolkitReminderById = async (req, res) => {
  const reminderId = req.params.id; // Assuming you're passing the reminder ID in the URL

  try {
    const query = `
        SELECT *
        FROM ToolkitReminders
        WHERE id = $1;
      `;

    const { rows } = await db.query(query, [reminderId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Toolkit reminder not found",
      });
    }

    const toolkitReminder = rows[0];
    return res.status(200).json({
      success: true,
      data: toolkitReminder,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.getAllToolkitReminders = async (req, res) => {
  try {
    const query = `
        SELECT *
        FROM ToolkitReminders;
      `;

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
