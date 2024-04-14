const cron = require("node-cron");
const admin = require("firebase-admin");
const db = require("../../db.js"); // Path to your db.js file
const { config } = require("dotenv");
config();

const serviceAccount = require("../../service_account.json"); // Change the path accordingly
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
// Function to set up and start the scheduled task
function startScheduledTask() {
  // Schedule task to run every minute
  cron.schedule("* * * * *", async () => {
    try {
      // Get current time
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour12: false,
      });

      // Query reminders for the current time
      const queryText = `
        SELECT user_id, reminder_message, reminder_time
        FROM ToolkitReminders
        WHERE reminder_time = $1
      `;
      const { rows } = await db.query(queryText, [currentTime]);

      // Iterate through reminders and send notifications
      for (const row of rows) {
        const { user_id, reminder_message } = row;
        console.log("Alert Sending ....");

        // Retrieve FCM token for the mentee
        const fcmTokensQuery = `
          SELECT fcm_token
          FROM mentees
          WHERE user_id = $1
        `;
        const fcmTokensResult = await db.query(fcmTokensQuery, [user_id]);
        const fcmToken = fcmTokensResult.rows[0].fcm_token;

        // Send notification to the mentee
        const message = {
          notification: {
            title: "Toolkit Reminder",
            body: reminder_message,
          },
          token: fcmToken,
        };
        await admin.messaging().send(message);
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  });

  // No need to start cron - it handles scheduling internally
}

module.exports = startScheduledTask;
