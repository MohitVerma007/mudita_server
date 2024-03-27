const db = require("../../db.js");

// Create a new technique
exports.createToolkit = async (req, res, formattedFileUrls) => {
  const { title, description, technique_id } = req.body;

  try {
    const query = `
      INSERT INTO Toolkit (title, cover_img, description, technique_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const cover_img = formattedFileUrls.cover_img[0].downloadURL;

    const { rows } = await db.query(query, [
      title,
      cover_img,
      description,
      technique_id,
    ]);

    const createdTechnique = rows[0];
    return res.status(201).json({
      success: true,
      data: createdTechnique,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all techniques with pagination
exports.getAllToolkits = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM Toolkit";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM Toolkit LIMIT $1 OFFSET $2";
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

// Get a specific technique by ID
exports.getToolkitById = async (req, res) => {
  const toolkitId = req.params.id;

  try {
    const query = "SELECT * FROM Toolkit WHERE id = $1";
    const { rows } = await db.query(query, [toolkitId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Toolkit not found",
      });
    }

    const toolkit = rows[0];
    return res.status(200).json({
      success: true,
      data: toolkit,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update a specific technique by ID
exports.updateToolkitById = async (req, res, formattedFileUrls) => {
  const techniqueId = req.params.id;
  const { title, description } = req.body;

  try {
    const query = `
      UPDATE Technique
      SET title = $1, file = $2, description = $3, music = $4
      WHERE id = $5
      RETURNING *;
    `;
    const gif = formattedFileUrls.gif[0].downloadURL;
    const music = formattedFileUrls.music[0].downloadURL;

    const { rows } = await db.query(query, [
      title,
      gif,
      description,
      music,
      techniqueId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Technique not found",
      });
    }

    const updatedTechnique = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedTechnique,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete a specific technique by ID
exports.deleteToolkitById = async (req, res) => {
  const toolkitId = req.params.id;

  try {
    const query = "DELETE FROM Toolkit WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [toolkitId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Toolkit not found",
      });
    }

    const deletedToolkit = rows[0];
    return res.status(200).json({
      success: true,
      is_deleted: "successfully Deleted !",
      data: deletedToolkit,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
