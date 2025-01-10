const db = require("../../db.js");

// Create a new technique
exports.createTechnique = async (req, res) => {
  const { title, description, type, time } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !type || !time) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, description, type, or time.",
      });
    }

    // Extract file paths from req.files
    const domain = process.env.DOMAIN || "http://localhost:8000";

    const gif = req.files?.gif?.[0]?.filename
      ? `${domain}/uploads/technique/${req.files.gif[0].filename}`
      : null;

    const music = req.files?.music?.[0]?.filename
      ? `${domain}/uploads/technique/${req.files.music[0].filename}`
      : null;

    const cover_img = req.files?.cover_img?.[0]?.filename
      ? `${domain}/uploads/technique/${req.files.cover_img[0].filename}`
      : null;

    // Ensure required files are present
    if (!gif || !cover_img) {
      return res.status(400).json({
        success: false,
        message: "Required files (gif or cover image) are missing.",
      });
    }

    // Insert technique into the database
    const query = `
      INSERT INTO Technique (title, file, description, music, cover_img, type, time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [title, gif, description, music, cover_img, type, time];
    const { rows } = await db.query(query, values);

    const createdTechnique = rows[0];
    return res.status(201).json({
      success: true,
      message: "Technique created successfully.",
      data: createdTechnique,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
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
exports.updateTechniqueById = async (req, res) => {
  const techniqueId = req.params.id;
  const { title, description, type, time } = req.body;

  try {
    const domain = process.env.DOMAIN || "http://localhost:8000";

    let gif = req.files?.gif?.[0]?.filename
      ? `${domain}/uploads/technique/${req.files.gif[0].filename}`
      : null;
    let music = req.files?.music?.[0]?.filename
      ? `${domain}/uploads/technique/${req.files.music[0].filename}`
      : null;
    let cover_img = req.files?.cover_img?.[0]?.filename
      ? `${domain}/uploads/technique/${req.files.cover_img[0].filename}`
      : null;

    // Fetch existing technique details
    const existingQuery = `SELECT * FROM Technique WHERE id = $1;`;
    const { rows: existingRows } = await db.query(existingQuery, [techniqueId]);
    const existingTechnique = existingRows[0];

    // Use existing values if no new input
    const updatedTitle = title || existingTechnique.title;
    const updatedDescription = description || existingTechnique.description;
    const updatedType = type || existingTechnique.type;
    const updatedTime = time || existingTechnique.time;

    // Update query
    const updateQuery = `
      UPDATE Technique
      SET title = $1, file = $2, description = $3, music = $4, cover_img = $5, type = $6, time = $7
      WHERE id = $8
      RETURNING *;
    `;

    const { rows } = await db.query(updateQuery, [
      updatedTitle,
      gif || existingTechnique.file, // Use existing file if new one is not uploaded
      updatedDescription,
      music || existingTechnique.music, // Use existing music if new one is not uploaded
      cover_img || existingTechnique.cover_img, // Use existing cover image if new one is not uploaded
      updatedType,
      updatedTime,
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
