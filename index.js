var Botkit = require("botkit");

// Expect a SLACK_TOKEN environment variable
var slackToken = process.env.SLACK_TOKEN
if (!slackToken) {
  console.error("SLACK_TOKEN is required!")
  process.exit(1)
}

var controller = Botkit.slackbot()
var bot = controller.spawn({
  token: slackToken
})

bot.startRTM(function (err, bot, payload) {
  if (err) {
    throw new Error("Could not connect to Slack")
  }
})

controller.on("bot_channel_join", function (bot, message) {
  bot.reply(message, "I'm here!")
})

// Mention listener
controller.hears(["hello", "hi", "sup", "howdy", "yo"], ["direct_mention"], function (bot, message) {
  bot.reply(message, "sup")
})

// DM listener
controller.hears(["hello", "hi", "sup", "howdy", "yo"], ["direct_message"], function (bot, message) {
  bot.reply(message, "Wuddup.")
  bot.reply(message, "It\'s nice to talk to you directly.")
})

controller.hears(".*", ["mention"], function (bot, message) {
  bot.reply(message, "You really do care about me. :heart:")
})

controller.hears("help", ["direct_message", "direct_mention"], function (bot, message) {
  var help = "I will respond to the following messages: \n" +
      "`bot hi` for a simple message.\n" +
      "`bot attachment` to see a Slack attachment message.\n" +
      "`@<your bot\'s name>` to demonstrate detecting a mention.\n" +
      "`bot help` to see this again."
  bot.reply(message, help)
})

controller.hears(["attachment"], ["direct_message", "direct_mention"], function (bot, message) {
  var text = "Beep Beep Boop is a ridiculously simple hosting platform for your Slackbots."
  var attachments = [{
    fallback: text,
    pretext: "We bring bots to life. :sunglasses: :thumbsup:",
    title: "Host, deploy and share your bot in seconds.",
    image_url: "https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png",
    title_link: "https://beepboophq.com/",
    text: text,
    color: "#7CD197"
  }]

  bot.reply(message, {
    attachments: attachments
  }, function (err, resp) {
    console.log(err, resp)
  })
})

// Custom scripts
// ==============

//=> Interpreter: translates Danish to English

// Expect a GOOGLE_TOKEN environment variable
var googleToken = process.env.GOOGLE_TOKEN;
if (!googleToken) {
    console.error("GOOGLE_TOKEN is required!")
    process.exit(1)
}

var googleTranslate = require("google-translate")(googleToken);

controller.hears(["translate", ".*"], ["direct_message", "direct_mention"], function (bot, message) {
    message.text = message.text.replace("@robotto ", "");
    message.text = message.text.replace("translate ", "");

    googleTranslate.translate(message.text, "en", function(err, translation) {
        try {
            bot.reply(message, ":flag-dk: => " + translation.translatedText);
        }
        catch (err) {
            bot.reply(message, err);
        }
    });
});
// <=

// This goes by the end of the file; it works as an "else" function for listener events.
controller.hears(".*", ["direct_message", "direct_mention"], function (bot, message) {
  bot.reply(message, "Sorry <@" + message.user + ">, I don\'t understand. \n")
})
