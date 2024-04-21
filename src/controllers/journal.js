const db = require("../../db.js");

// Update a journal entry
// Post a new journal entry
exports.postJournalEntry = async (req, res) => {
  try {
    const { user_id, month } = req.body;

    const selectQuery = `
      SELECT * FROM journal
      WHERE user_id = $1;
    `;

    const { rows: existingRows } = await db.query(selectQuery, [user_id]);

    if (existingRows.length === 0) {
      console.log("No journal entry found for the user, inserting new entry");
      // Insert a new entry since no record found for the user
      const insertQuery = `
        INSERT INTO journal (user_id, current_score, month, previous_scores)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      const { rows: insertedRows } = await db.query(insertQuery, [
        user_id,
        req.body.current_score,
        req.body.month,
        {}, // Start with an empty JSON object
      ]);

      return res.status(201).json({
        success: true,
        data: insertedRows[0],
      });
    }

    const existingEntry = existingRows[0];

    if (existingEntry.month === req.body.month) {
      // console.log("Month matches");
      const avgscore = Math.floor(
        (existingEntry.current_score + req.body.current_score) / 2
      );

      const updateQuery = `
        UPDATE journal
        SET current_score = $1
        WHERE user_id = $2
        RETURNING *;
      `;

      const { rows: updatedRows } = await db.query(updateQuery, [
        avgscore,
        user_id,
      ]);

      return res.status(200).json({
        success: true,
        data: updatedRows[0],
      });
    } else {
      // console.log("Month does not match");

      // Construct the new JSONB object by appending the new key-value pair
      const updatedPreviousScores = {
        ...existingEntry.previous_scores,
        [existingEntry.month]: existingEntry.current_score,
      };

      const updateQuery = `
        UPDATE journal
        SET current_score = $1, previous_scores = $2, month = $3
        WHERE user_id = $4
        RETURNING *;
      `;

      const { rows: updatedRows } = await db.query(updateQuery, [
        req.body.current_score,
        updatedPreviousScores,
        month,
        user_id,
      ]);

      return res.status(200).json({
        success: true,
        data: updatedRows[0],
      });
    }
  } catch (error) {
    console.error("Error posting journal entry:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

exports.getAllJournalEntries = async (req, res) => {
  try {
    // Query to select all entries from the journal table
    const query = `
        SELECT user_id, current_score, month, previous_scores
        FROM journal;
      `;

    // Execute the query
    const { rows } = await db.query(query);

    // Return the fetched entries
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
