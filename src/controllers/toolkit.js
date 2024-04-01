const db = require("../../db.js");

// Create a new toolkit
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

// Get all Toolkit with pagination
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

// Get a specific Toolkit by ID
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

// Update a specific Toolkit by ID
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

// Delete a specific toolkit by ID
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

// Toolkit Journey

// Start Step Toolkit
exports.starttoolkitStep = async (req, res) => {
  const { user_id, curr_toolkit_id, technique_id } = req.body;

  try {
    // Check if the performance entry already exists for the user
    const checkQuery = `
      SELECT * FROM Performance
      WHERE user_id = $1;
    `;
    const { rowCount, rows } = await db.query(checkQuery, [user_id]);

    if (rowCount > 0) {
      // Update the existing performance entry
      const existingPerformanceEntry = rows[0];
      const updateQuery = `
        UPDATE Performance
        SET percentage_completed = 0.00, curr_toolkit_id = $1, technique_id = $2
        WHERE user_id = $3
        RETURNING *;
      `;
      const { rows: updatedRows } = await db.query(updateQuery, [
        curr_toolkit_id,
        technique_id,
        user_id,
      ]);
      const updatedPerformanceEntry = updatedRows[0];

      return res.status(200).json({
        success: true,
        data: updatedPerformanceEntry,
      });
    } else {
      // Create a new performance entry
      const insertQuery = `
        INSERT INTO Performance (user_id, curr_toolkit_id, technique_id, percentage_completed)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const { rows: createdRows } = await db.query(insertQuery, [
        user_id,
        curr_toolkit_id,
        technique_id,
        0.0,
      ]);
      const createdPerformanceEntry = createdRows[0];

      return res.status(201).json({
        success: true,
        data: createdPerformanceEntry,
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update Step Toolkit
exports.updatetoolkitStep = async (req, res) => {
  const { user_id, curr_toolkit_id, technique_id } = req.body;

  try {
    // Check if the performance entry already exists
    const checkQuery = `
        SELECT * FROM Performance
        WHERE user_id = $1 AND curr_toolkit_id = $2;
      `;
    const { rowCount, rows } = await db.query(checkQuery, [
      user_id,
      curr_toolkit_id,
    ]);

    if (rowCount > 0) {
      // Update the existing performance entry
      const existingPerformanceEntry = rows[0];
      let oldTechniqueId = existingPerformanceEntry.technique_id; // Set oldTechniqueId to the technique_id of the existing performance entry

      //Percentage Operations
      // Fetch toolkit details including technique_id array
      const toolkitQuery = `
    SELECT technique_id FROM Toolkit
    WHERE id = $1;
  `;
      const toolkitResult = await db.query(toolkitQuery, [curr_toolkit_id]);

      if (toolkitResult.rows.length > 0) {
        const toolkitTechniqueIds = toolkitResult.rows[0].technique_id;

        // Calculate percentage completed
        let percentageCompleted = existingPerformanceEntry.percentage_completed;
        let newCurrToolkitId = curr_toolkit_id;

        if (oldTechniqueId && toolkitTechniqueIds.includes(oldTechniqueId)) {
          const index = toolkitTechniqueIds.indexOf(oldTechniqueId);
          const toolkitArraySize = toolkitTechniqueIds.length;
          percentageCompleted = ((index + 1) / toolkitArraySize) * 100;
        }

        //

        const updateQuery = `
          UPDATE Performance
          SET technique_id = $1, percentage_completed = $2, curr_toolkit_id = $3
          WHERE user_id = $4 AND curr_toolkit_id = $5
          RETURNING *;
        `;
        const { rows: updatedRows } = await db.query(updateQuery, [
          technique_id,
          percentageCompleted,
          newCurrToolkitId,
          user_id,
          curr_toolkit_id,
        ]);

        const updatedPerformanceEntry = updatedRows[0];
        return res.status(200).json({
          success: true,
          data: updatedPerformanceEntry,
        });
      } else {
        return res.status(404).json({
          success: false,
          error: "Performance entry not found",
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        error: "Toolkit not found",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Finish Step Toolkit
exports.finishtoolkitStep = async (req, res) => {
  const { user_id, curr_toolkit_id } = req.body;

  try {
    // Validate input parameters
    if (!user_id || !curr_toolkit_id) {
      return res.status(400).json({
        success: false,
        error: "Missing user_id or curr_toolkit_id in request body",
      });
    }

    // Check if the performance entry already exists
    const checkQuery = `
      SELECT * FROM Performance
      WHERE user_id = $1 AND curr_toolkit_id = $2;
    `;
    const { rowCount, rows } = await db.query(checkQuery, [
      user_id,
      curr_toolkit_id,
    ]);

    if (rowCount > 0) {
      // Update the existing performance entry to mark the toolkit as finished
      const updateQuery = `
        UPDATE Performance
        SET technique_id = NULL, percentage_completed = 100.00, curr_toolkit_id = NULL, completed_toolkit_ids = array_append(completed_toolkit_ids, $1)
        WHERE user_id = $2 AND curr_toolkit_id = $3
        RETURNING *;
      `;
      const { rows: updatedRows } = await db.query(updateQuery, [
        curr_toolkit_id,
        user_id,
        curr_toolkit_id,
      ]);

      const updatedPerformanceEntry = updatedRows[0];
      return res.status(200).json({
        success: true,
        data: updatedPerformanceEntry,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: "Performance entry not found",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Skip Step Toolkit
exports.skiptoolkitStep = async (req, res) => {
  const { user_id, curr_toolkit_id } = req.body;

  try {
    // Validate input parameters
    if (!user_id || !curr_toolkit_id) {
      return res.status(400).json({
        success: false,
        error: "Missing user_id or curr_toolkit_id in request body",
      });
    }

    // Check if the performance entry already exists
    const checkQuery = `
      SELECT * FROM Performance
      WHERE user_id = $1 AND curr_toolkit_id = $2;
    `;
    const { rowCount, rows } = await db.query(checkQuery, [
      user_id,
      curr_toolkit_id,
    ]);

    if (rowCount > 0) {
      // Update the existing performance entry to mark the toolkit as finished
      const updateQuery = `
        UPDATE Performance
        SET technique_id = NULL, percentage_completed = NULL, curr_toolkit_id = NULL
        WHERE user_id = $1 AND curr_toolkit_id = $2
        RETURNING *;
      `;
      const { rows: updatedRows } = await db.query(updateQuery, [
        user_id,
        curr_toolkit_id,
      ]);

      const updatedPerformanceEntry = updatedRows[0];
      return res.status(200).json({
        success: true,
        message: "Journey Skipped Successfully",
        data: updatedPerformanceEntry,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: "Performance entry not found",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Get All Performance
exports.getAllPerformance = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM Performance";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM Performance LIMIT $1 OFFSET $2";
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

// Get a specific Performance by ID
exports.getPerformanceById = async (req, res) => {
  const user_id = req.params.id;

  try {
    const query = "SELECT * FROM Performance WHERE user_id = $1";
    const { rows } = await db.query(query, [user_id]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Record not found",
      });
    }

    const Record = rows[0];
    return res.status(200).json({
      success: true,
      data: Record,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete a specific Performance by ID
exports.deletePerformanceById = async (req, res) => {
  const performanceId = req.params.id;

  try {
    const query = "DELETE FROM Performance WHERE user_id = $1 RETURNING *";
    const { rows } = await db.query(query, [performanceId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Record not found",
      });
    }

    const deletedPerformance = rows[0];
    return res.status(200).json({
      success: true,
      is_deleted: "successfully Deleted !",
      data: deletedPerformance,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
