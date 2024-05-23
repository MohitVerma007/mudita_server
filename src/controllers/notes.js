const db = require("../../db.js");

exports.createNote = async (req, res) => {
  const { title, description, user_id } = req.body;

  try {
    const query = `
        INSERT INTO notes (title, description, user_id)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
    const { rows } = await db.query(query, [title, description, user_id]);

    const createdNote = rows[0];
    return res.status(201).json({
      success: true,
      data: createdNote,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.getAllNote = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM notes";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM notes LIMIT $1 OFFSET $2";
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

exports.getNoteById = async (req, res) => {
  const noteId = req.params.id;

  try {
    const query = "SELECT * FROM notes WHERE note_id = $1";
    const { rows } = await db.query(query, [noteId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Note not found",
      });
    }

    const note = rows[0];
    return res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateNoteById = async (req, res) => {
  const noteId = req.params.id;
  const { title, description } = req.body;

  try {
    const query = `
        UPDATE notes
        SET title = $1, description = $2
        WHERE note_id = $3
        RETURNING *;
      `;

    const { rows } = await db.query(query, [title, description, noteId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Note not found",
      });
    }

    const updatedNote = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedNote,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteNoteById = async (req, res) => {
  const noteId = req.params.id;

  try {
    const query = "DELETE FROM notes WHERE note_id = $1 RETURNING *";
    const { rows } = await db.query(query, [noteId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Note not found",
      });
    }

    const deletedNote = rows[0];
    return res.status(200).json({
      success: true,
      is_deleted: "Successfully deleted!",
      data: deletedNote,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
