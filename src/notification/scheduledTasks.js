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

function sendAlertAtTenPM() {
  cron.schedule("07 11 * * *", async () => {
    try {
      // Get all mentees with non-empty FCM tokens
      const allMenteesQuery = `
        SELECT user_id, fcm_token
        FROM mentees
        WHERE fcm_token IS NOT NULL AND fcm_token != ''
      `;
      const { rows } = await db.query(allMenteesQuery);

      // Iterate through mentees and send notifications
      for (const row of rows) {
        const { user_id, fcm_token } = row;

        console.log("Alert Sending ....");

        // Send notification to the mentee only if FCM token is not empty
        if (fcm_token) {
          console.log(user_id);
          const message = {
            notification: {
              title: "Toolkit Reminder",
              body: "Your reminder message goes here.", // Customize your message here
            },
            token: fcm_token,
          };
          await admin.messaging().send(message);
        }
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
    }
  });

  // No need to start cron - it handles scheduling internally
}

module.exports = {
  startScheduledTask,
  sendAlertAtTenPM,
};
