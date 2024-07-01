const express = require("express");
const app = express();
const { PORT, CLIENT_URL } = require("./constants");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");

// import scheduled notification sender
const startScheduledTask = require("./notification/scheduledTasks");

startScheduledTask.startScheduledTask();
startScheduledTask.sendAlertAtTenPM();

//import passport middleware
require("./middlewares/passport-middleware");

//initialize middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(passport.initialize());

//import routes
const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");
const sessionRoutes = require("./routes/session");
const questionRoutes = require("./routes/quiz_Question");
const answerRoutes = require("./routes/quiz_Answer");
const sosRoutes = require("./routes/sos");
const blogRoutes = require("./routes/blog");
const instaRoutes = require("./routes/insta");
const bannerRoutes = require("./routes/banner");
const socialRoutes = require("./routes/social_media");
const techniqueRoutes = require("./routes/technique");
const toolkitRoutes = require("./routes/toolkit");
const faqRoutes = require("./routes/faq");
const journalRoutes = require("./routes/journal");
const schedule_alert = require("./routes/schedule_alerts");
const mail = require("./routes/mail");
const { chatbot } = require("./chatbot/chatbot");
const noteRoutes = require("./routes/notes");
const commentRoutes = require("./routes/comment");
const timeSlotRoutes = require("./routes/time_slot");
const slotReqRoutes = require("./routes/slot_req");

//initialize routes
app.use("/api/v1", authRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/session", sessionRoutes);
app.use("/api/v1/question", questionRoutes);
app.use("/api/v1/answer", answerRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/insta", instaRoutes);
app.use("/api/v1/banner", bannerRoutes);
app.use("/api/v1/sos", sosRoutes);
app.use("/api/v1/social", socialRoutes);
app.use("/api/v1/technique", techniqueRoutes);
app.use("/api/v1/toolkit", toolkitRoutes);
app.use("/api/v1/faq", faqRoutes);
app.use("/api/v1/journal", journalRoutes);
app.use("/api/v1/alert", schedule_alert);
app.use("/api/v1/email", mail);
app.use("/api/v1/note", noteRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/time_slot", timeSlotRoutes);
app.use("/api/v1/slot_req", slotReqRoutes);

// Chatbot
app.post("/api/v1/chatbot", chatbot);

//app start
const appStart = () => {
  try {
    app.listen(PORT, () => {
      console.log(`The app is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
};

appStart();
