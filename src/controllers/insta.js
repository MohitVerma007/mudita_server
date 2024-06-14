const db = require("../../db.js");

// ****** Firebase Setup Start  ******

const admin = require("firebase-admin");
const { firebaseConfig } = require("../config/firebase_config");
const { getStorage, ref, deleteObject } = require("firebase/storage");
const storage = getStorage();

// **** Firebase Setup End ******

// Create a new Insta post
exports.createInsta = async (req, res, formattedFileUrls) => {
  const { title, video } = req.body;

  try {
    const query = `
      INSERT INTO Insta (title, img, video)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const img = formattedFileUrls.img[0].downloadURL;
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
    const img = formattedFileUrls.img[0].downloadURL;

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
        error: "Insta post not found",
      });
    }

    const deletedInsta = rows[0];
    console.log(rows[0].img);

    const previewUrl = rows[0].img;
    // Extract the file name from the preview URL
    const fileNameWithEncoding = previewUrl.split("/").pop().split("?")[0];
    const fileUrl = decodeURIComponent(fileNameWithEncoding);

    const desertRef = ref(storage, `${fileUrl}`);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        console.log("Deleted file from bucket");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        console.error(error.message);
      });

    return res.status(200).json({
      success: true,
      is_deleted: "successfully Deleted !",
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
