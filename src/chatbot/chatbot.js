// const bodyParser = require("body-parser");
const intents = require("./intents.json"); // Assuming intents are stored in a JSON file
// app.use(bodyParser.json());

function generateResponse(message) {
  for (const intent of intents.intents) {
    for (const pattern of intent.patterns) {
      if (message.includes(pattern.toLowerCase())) {
        return intent.responses[
          Math.floor(Math.random() * intent.responses.length)
        ];
      }
    }
  }
  return "Sorry, I didn't understand that.";
}

exports.chatbot = async (req, res) => {
  const message = req.body.message.toLowerCase();
  const response = generateResponse(message);
  res.json({ message: response });
};
