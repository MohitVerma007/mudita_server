const db = require("../../db.js");

// ****** Firebase Setup Start  ******

const admin = require("firebase-admin");
const { firebaseConfig } = require("../config/firebase_config");
const { getStorage, ref, deleteObject } = require("firebase/storage");
const storage = getStorage();

// **** Firebase Setup End ******

// Create a new redemption request
exports.createRedeemReq = async (req, res) => {
  const { mentor_id, points, status } = req.body;

  try {
    const query = `
      INSERT INTO redeem_req (mentor_id, points, status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const { rows } = await db.query(query, [mentor_id, points, status]);

    const createdRedeemReq = rows[0];
    return res.status(201).json({
      success: true,
      data: createdRedeemReq,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get all redemption requests with pagination
exports.getAllRedeemReqs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 per page
  const offset = (page - 1) * limit;

  try {
    const totalCountQuery = "SELECT COUNT(*) FROM redeem_req";
    const totalCountResult = await db.query(totalCountQuery);
    const totalCount = parseInt(totalCountResult.rows[0].count);

    const query = "SELECT * FROM redeem_req LIMIT $1 OFFSET $2";
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

// Get redemption request by ID
exports.getRedeemReqById = async (req, res) => {
  const redeemReqId = req.params.id;

  try {
    const query = "SELECT * FROM redeem_req WHERE id = $1";
    const { rows } = await db.query(query, [redeemReqId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Redemption request not found",
      });
    }

    const redeemReq = rows[0];
    return res.status(200).json({
      success: true,
      data: redeemReq,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update redemption request by ID
// exports.updateRedeemReqById = async (req, res, formattedFileUrls) => {
//   const redeemReqId = req.params.id;
//   const { mentor_id, points, status } = req.body;

//   // Check if an image URL was provided and validate it
//   const img = formattedFileUrls.img ? formattedFileUrls.img[0].downloadURL : null;
//   if (img && !isURL(img)) {
//     return res.status(400).json({
//       error: "Invalid URL format for img field",
//     });
//   }

//   try {
//     const query = `
//       UPDATE redeem_req
//       SET mentor_id = $1, points = $2, status = $3, img = $4
//       WHERE id = $5
//       RETURNING *;
//     `;

//     const { rows } = await db.query(query, [mentor_id, points, status, img, redeemReqId]);

//     if (rows.length === 0) {
//       return res.status(404).json({
//         error: "Redemption request not found",
//       });
//     }

//     const updatedRedeemReq = rows[0];
//     return res.status(200).json({
//       success: true,
//       data: updatedRedeemReq,
//     });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// Delete redemption request by ID
exports.deleteRedeemReqById = async (req, res) => {
  const redeemReqId = req.params.id;

  try {
    const query = "DELETE FROM redeem_req WHERE id = $1 RETURNING *";
    const { rows } = await db.query(query, [redeemReqId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Redemption request not found",
      });
    }

    const deletedRedeemReq = rows[0];
    console.log(rows[0].img);

    const previewUrl = rows[0].img;
    if (previewUrl) {
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
    }

    return res.status(200).json({
      success: true,
      is_deleted: "Successfully deleted!",
      data: deletedRedeemReq,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};


// exports.approveRedeemReqById = async (req, res) => {
//   const redeemReqId = req.params.id;

//   try {
//     // Start a transaction
//     await db.query('BEGIN');

//     // Get the redemption request
//     const redeemReqQuery = "SELECT * FROM redeem_req WHERE id = $1";
//     const { rows: redeemReqRows } = await db.query(redeemReqQuery, [redeemReqId]);

//     if (redeemReqRows.length === 0) {
//       return res.status(404).json({
//         error: "Redemption request not found",
//       });
//     }

//     const redeemReq = redeemReqRows[0];

//     // Get the mentor's rewards
//     const rewardsQuery = "SELECT * FROM rewards WHERE mentor_id = $1";
//     const { rows: rewardsRows } = await db.query(rewardsQuery, [redeemReq.mentor_id]);

//     if (rewardsRows.length === 0) {
//       return res.status(404).json({
//         error: "Mentor rewards not found",
//       });
//     }

//     const rewards = rewardsRows[0];

//     // Check if the mentor has enough points
//     if (rewards.points < redeemReq.points) {
//       return res.status(400).json({
//         error: "Not enough points for redemption",
//       });
//     }

//     // Deduct the points from the mentor's rewards
//     const updateRewardsQuery = `
//       UPDATE rewards
//       SET points = points - $1, redeem = redeem + $1
//       WHERE mentor_id = $2
//       RETURNING *;
//     `;
//     const { rows: updatedRewardsRows } = await db.query(updateRewardsQuery, [redeemReq.points, redeemReq.mentor_id]);

//     // Update the status of the redemption request to "approved"
//     const updateRedeemReqQuery = `
//       UPDATE redeem_req
//       SET status = 'approved'
//       WHERE id = $1
//       RETURNING *;
//     `;
//     const { rows: updatedRedeemReqRows } = await db.query(updateRedeemReqQuery, [redeemReqId]);

//     // Commit the transaction
//     await db.query('COMMIT');

//     return res.status(200).json({
//       success: true,
//       redeem_req: updatedRedeemReqRows[0],
//       rewards: updatedRewardsRows[0],
//     });
//   } catch (error) {
//     // Rollback the transaction in case of error
//     await db.query('ROLLBACK');
//     console.error(error.message);
//     return res.status(500).json({
//       error: error.message,
//     });
//   }
// };



exports.updateRedeemReqById = async (req, res, formattedFileUrls) => {
  const redeemReqId = req.params.id;
  const { mentor_id, points, status="approved" } = req.body;

  // Check if an image URL was provided and validate it
  const img = formattedFileUrls.img ? formattedFileUrls.img[0].downloadURL : null;
  // if (img && !isURL(img)) {
  //   return res.status(400).json({
  //     error: "Invalid URL format for img field",
  //   });
  // }

  try {
    // Start a transaction
    await db.query('BEGIN');

    // Get the redemption request
    const redeemReqQuery = "SELECT * FROM redeem_req WHERE id = $1";
    const { rows: redeemReqRows } = await db.query(redeemReqQuery, [redeemReqId]);

    if (redeemReqRows.length === 0) {
      return res.status(404).json({
        error: "Redemption request not found",
      });
    }

    const redeemReq = redeemReqRows[0];

    // Get the mentor's rewards
    const rewardsQuery = "SELECT * FROM rewards WHERE mentor_id = $1";
    const { rows: rewardsRows } = await db.query(rewardsQuery, [mentor_id]);

    if (rewardsRows.length === 0) {
      return res.status(404).json({
        error: "Mentor rewards not found",
      });
    }

    const rewards = rewardsRows[0];

    // Check if the mentor has enough points
    if (rewards.points < points) {
      return res.status(400).json({
        error: "Not enough points for redemption",
      });
    }

    // Deduct the points from the mentor's rewards
    const updateRewardsQuery = `
      UPDATE rewards
      SET points = points - $1, redeem = redeem + $1
      WHERE mentor_id = $2
      RETURNING *;
    `;
    const { rows: updatedRewardsRows } = await db.query(updateRewardsQuery, [points, mentor_id]);

    // Update the redemption request
    const updateRedeemReqQuery = `
      UPDATE redeem_req
      SET mentor_id = $1, points = $2, status = $3, img = $4
      WHERE id = $5
      RETURNING *;
    `;
    const { rows: updatedRedeemReqRows } = await db.query(updateRedeemReqQuery, [mentor_id, points, status, img, redeemReqId]);

    // Commit the transaction
    await db.query('COMMIT');

    return res.status(200).json({
      success: true,
      redeem_req: updatedRedeemReqRows[0],
      rewards: updatedRewardsRows[0],
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await db.query('ROLLBACK');
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};