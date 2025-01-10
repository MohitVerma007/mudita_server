const db = require("../../db.js");
const fs = require("fs");
const path = require("path");

// Create a new Insta post
exports.createInsta = async (req, res) => {
  const { title, video } = req.body;

  try {
    const query = `
      INSERT INTO Insta (title, img, video)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    let img = null;

    // Handle single image upload
    if (req.file) {
      const domain = process.env.DOMAIN;
      img = `${domain}/uploads/insta/${req.file.filename}`;
    }

    const { rows } = await db.query(query, [title, img, video]);

    const createdInsta = rows[0];
    return res.status(201).json({
      success: true,
      data: createdInsta,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all Insta posts with pagination
exports.getAllInstas = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM Insta";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM Insta LIMIT $1 OFFSET $2";
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

// Get Insta post by ID
exports.getInstaById = async (req, res) => {
  const InstaId = req.params.id;

  try {
    const query = "SELECT * FROM Insta WHERE id = $1";
    const { rows } = await db.query(query, [InstaId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Insta post not found",
      });
    }

    const Insta = rows[0];
    return res.status(200).json({
      success: true,
      data: Insta,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update Insta post by ID
exports.updateInstaById = async (req, res, formattedFileUrls) => {
  const InstaId = req.params.id;
  const { title, video } = req.body;

  try {
    const query = `
      UPDATE Insta
      SET title = $1, img = $2, video = $3
      WHERE id = $4
      RETURNING *;
    `;
    let img = null;

    // Handle single image upload
    if (req.file) {
      const domain = process.env.DOMAIN;
      img = `${domain}/uploads/insta/${req.file.filename}`;
    }

    const { rows } = await db.query(query, [title, img, video, InstaId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Insta post not found",
      });
    }

    const updatedInsta = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedInsta,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete Insta post by ID

exports.deleteInstaById = async (req, res) => {
  const InstaId = req.params.id;

  try {
    const query = "DELETE FROM Insta WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [InstaId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Insta not found",
      });
    }

    const deletedInsta = rows[0];
    const imgUrl = deletedInsta.img; // Adjust to match your DB column name for the image URL

    if (imgUrl) {
      const filePath = path.join(
        __dirname,
        "../../uploads/insta", // Adjust based on your upload folder structure
        path.basename(imgUrl)
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting  image file:", err.message);
        } else {
          console.log("Insta image file deleted successfully");
        }
      });
    }

    return res.status(200).json({
      success: true,
      is_deleted: "Successfully Deleted!",
      data: deletedInsta,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};


// Lik Insta post by User ID
exports.favInstaById = async (req, res) => {
  const InstaId = req.params.id;
  const { user_id } = req.body;

  try {
    const query = `
      UPDATE Insta
      SET fav = array_append(fav, $1)
      WHERE id = $2
      RETURNING *;
    `;

    const { rows } = await db.query(query, [user_id, InstaId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Insta post not found",
      });
    }

    const updatedInsta = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedInsta,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
