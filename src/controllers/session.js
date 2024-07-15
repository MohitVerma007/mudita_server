const fs = require('fs');
const { google } = require('googleapis');
const db = require('../../db.js');

const CREDENTIALS_PATH = '././credential.json';
const TOKEN_PATH = '././token.json';


const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// Function to authorize and get OAuth2 client
async function authorize() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    return getAccessToken(oAuth2Client);
  }
}

// Function to get access token interactively
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        resolve(oAuth2Client);
      });
    });
  });
}

// Function to create a Google Calendar event with a Meet link
async function createEvent(auth, menteeEmail, mentorEmail, startTime, endTime) {
  const calendar = google.calendar({ version: 'v3', auth });

  const event = {
    summary: 'Meeting with Google Meet Link',
    location: 'Online',
    description: 'Meeting to discuss project details.',
    start: {
      // dateTime: startTime.toISOString(),
      dateTime: startTime,
      timeZone: 'Asia/Kolkata',
    },
    end: {
      // dateTime: endTime.toISOString(),
      dateTime: endTime,
      timeZone: 'Asia/Kolkata',
    },
    conferenceData: {
      createRequest: {
        requestId: 'random-string',
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    attendees: [{ email: menteeEmail }, { email: mentorEmail }],
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });
    return response.data.hangoutLink;
  } catch (err) {
    throw new Error('Error creating event: ' + err.message);
  }
}

// Create a new session with Google Meet link
exports.menteeReq = async (req, res) => {
  const { mentee_id, mentor_id, mentee_text, slot_id, start_time, end_time } = req.body;

  try {
    // Authorize and create Google Meet link
    const auth = await authorize();
    const menteeEmailQuery = 'SELECT email FROM users WHERE user_id = $1';
    const mentorEmailQuery = 'SELECT email FROM users WHERE user_id = $1';

    const menteeResult = await db.query(menteeEmailQuery, [mentee_id]);
    const mentorResult = await db.query(mentorEmailQuery, [mentor_id]);

    const menteeEmail = menteeResult.rows[0].email;
    const mentorEmail = mentorResult.rows[0].email;

    const meetLink = await createEvent(auth, menteeEmail, mentorEmail, new Date(start_time), new Date(end_time));

    console.log(meetLink)

    // Insert session into the database
    const query = `
      INSERT INTO session (mentee_id, mentor_id, status, mentee_text, slot_id, meet_link, is_completed, created_date)
      VALUES ($1, $2, 'pending', $3, $4, $5, FALSE, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [mentee_id, mentor_id, mentee_text, slot_id, meetLink]);

    const createdSession = rows[0];
    return res.status(201).json({
      success: true,
      data: createdSession,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};



// Get all sessions
exports.getAllSessions = async (req, res) => {
  try {
    const query = "SELECT * FROM session";
    const { rows } = await db.query(query);
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Get session by ID
exports.getSessionById = async (req, res) => {
  const sessionId = req.params.id;

  try {
    const query = "SELECT * FROM session WHERE session_id = $1";
    const { rows } = await db.query(query, [sessionId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const session = rows[0];
    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Update session by ID
exports.mentorReqById = async (req, res) => {
  const sessionId = req.params.id;
  const { status, meet_link, mentor_text } = req.body;

  try {
    const query = `
      UPDATE session
      SET status = $1, meet_link = $2, mentor_text = $3
      WHERE session_id = $4
      RETURNING *;
    `;

    const { rows } = await db.query(query, [
      status,
      meet_link,
      mentor_text,
      sessionId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const updatedSession = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.completeSession = async (req, res) => {
  const sessionId = req.params.id;
  const { is_completed } = req.body;

  try {
    const query = `
    UPDATE session
    SET is_completed = $1
    WHERE session_id = $2 AND status = 'approved'
    RETURNING *;
  `;
    const { rows } = await db.query(query, [is_completed, sessionId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const updatedSession = rows[0];
    return res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// Delete session by ID
exports.deleteSessionById = async (req, res) => {
  const sessionId = req.params.id;

  try {
    const query = "DELETE FROM session WHERE session_id = $1 RETURNING *";
    const { rows } = await db.query(query, [sessionId]);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Session not found",
      });
    }

    const deletedSession = rows[0];
    return res.status(200).json({
      success: true,
      is_deleted: "Successfully deleted!",
      data: deletedSession,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
