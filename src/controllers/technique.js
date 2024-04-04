const db = require("../../db.js");

// Create a new technique
exports.createTechnique = async (req, res, formattedFileUrls) => {
  const { title, description } = req.body;

  try {
    const query = `
      INSERT INTO Technique (title, file, description, music, cover_img)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const gif = formattedFileUrls.gif[0].downloadURL;
    const music = formattedFileUrls.music[0].downloadURL;
    const cover_img = formattedFileUrls.cover_img[0].downloadURL;

    const { rows } = await db.query(query, [
      title,
      gif,
      description,
      music,
      cover_img,
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
exports.getAllTechniques = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM Technique";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM Technique LIMIT $1 OFFSET $2";
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
exports.getTechniqueById = async (req, res) => {
  const techniqueId = req.params.id;

  try {
    const query = "SELECT * FROM Technique WHERE id = $1";
    const { rows } = await db.query(query, [techniqueId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Technique not found",
      });
    }

    const technique = rows[0];
    return res.status(200).json({
      success: true,
      data: technique,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update a specific technique by ID
exports.updateTechniqueById = async (req, res, formattedFileUrls) => {
  const techniqueId = req.params.id;
  const { title, description } = req.body;

  try {
    const query = `
      UPDATE Technique
      SET title = $1, file = $2, description = $3, music = $4, cover_img = $5
      WHERE id = $6
      RETURNING *;
    `;
    const gif = formattedFileUrls.gif[0].downloadURL;
    const music = formattedFileUrls.music[0].downloadURL;
    const cover_img = formattedFileUrls.cover_img[0].downloadURL;

    const { rows } = await db.query(query, [
      title,
      gif,
      description,
      music,
      cover_img,
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
exports.deleteTechniqueById = async (req, res) => {
  const techniqueId = req.params.id;

  try {
    const query = "DELETE FROM Technique WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [techniqueId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Technique not found",
      });
    }

    const deletedTechnique = rows[0];
    return res.status(200).json({
      success: true,
      is_deleted: "successfully Deleted !",
      data: deletedTechnique,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
