var Botkit = require("botkit");

const inflector = require("./scripts/inflector");

var googleTranslate = require("google-translate")(googleToken);
var oxr = require("open-exchange-rates"),
    fx = require("money"),
    d3Format = require("d3-format");

var config = {
    "robot": "Robotto",
    "color": "#cfc"
};

var slackToken = process.env.SLACK_TOKEN;
var googleToken = process.env.GOOGLE_TOKEN;
var oxrToken = process.env.OXR_TOKEN; // openexchangerates.com

if (!slackToken)  { console.error("SLACK_TOKEN is required!"); process.exit(1); }
if (!googleToken) { console.error("GOOGLE_TOKEN is required!"); process.exit(1); }
if (!oxrToken)    { console.error("OXR_TOKEN is required!"); process.exit(1); }

var controller = Botkit.slackbot();
var bot = controller.spawn({
    "token": slackToken
});

bot.startRTM(function(err, bot, payload) {
    if (err) {
        throw new Error("Could not connect to Slack");
    }
});

// Join message
controller.on("bot_channel_join", function(bot, message) {
    bot.reply(message, "I'm here!");
});

// Mention listener
controller.hears(["hello", "hi", "sup", "howdy", "yo"], ["direct_mention"], function(bot, message) {
    bot.reply(message, "sup");
});

// DM listener
controller.hears(["hello", "hi", "sup", "howdy", "yo"], ["direct_message"], function(bot, message) {
    bot.reply(message, "Wuddup.");
    bot.reply(message, "It\'s nice to talk to you directly.");
});

// Help message
controller.hears("help", ["direct_message", "direct_mention"], function(bot, message) {
    var help = "I will respond to the following messages: \n" +
        "`bot conjugate [infinitive verb]` to conjugate an English verb.\n" +
        "`bot convert [number]` to convert DKK to USD.\n" +
        "`bot convert from [number] [currency1] to [currency2]` to convert a currency.\n" +
        "`bot translate [words]` to translate anything into English.\n" +

        "`bot help` to see this again.";
    bot.reply(message, help);
});

// Custom scripts
// ==============

//=> Interpreter: translates Danish to English
controller.hears(["^translate (.*)$"], ["direct_message", "direct_mention"], function(bot, message) {
    googleTranslate.translate(message.match[1], "da", "en", function(err, translation) {
        try {
            bot.reply(message, ":flag-dk: => " + "*" + translation.translatedText + "*");
        }
        catch (err) {
            bot.reply(message, err);
        }
    });
});
// <=

//=> Converter: converts currencies
fx.settings = {"from": "DKK", "to": "USD"}; //! Broken
var fxSettingsIsBroken = true;

oxr.set({"app_id": oxrToken});

var format = d3Format.format(",.3s"),
    // cf. stackoverflow.com/a/354216
    currencyPattern = /\b([+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?) (\w{3}) to (\w{3})\b/g;

// Takes a value, an input currency, and returns an output currency
controller.hears(["^convert from (.*)$"], ["direct_message", "direct_mention"], function(bot, message) {
    oxr.latest(function() {
        try {
            fx.rates = oxr.rates,
            fx.base = oxr.base;

            match = currencyPattern.exec(message.match[1]);

            // Uppercase currencies are required---apparently
            num = match[1],
            fromCur = match[2].toUpperCase(),
            toCur = match[3].toUpperCase();

            result = format(fx(num).from(fromCur).to(toCur));

            bot.reply(message, "*" + result + "*" + " " + toCur + " _(=" + format(num) + " " + fromCur + ")_");
        }
        catch (err) {
            bot.reply(message, err);
        }
    });
});

// Converts a number from USD to DKK
controller.hears(["^convert (.*)$"], ["direct_message", "direct_mention"], function(bot, message) {
    if (message.match[1].indexOf("to ") !== -1) {
        bot.reply(message, "Oops, you used the wrong syntax. Try `convert from (...) to (...)`.");
    }

    oxr.latest(function() {
        try {
            fx.rates = oxr.rates,
            fx.base = oxr.base;

            // fromCur = "",
            // toCur = "",
            num = message.match[1];

            if (fxSettingsIsBroken) { // Long conversion with explicit currencies
                fromCur = fx.settings.from, //  message.from || fx.settings.from
                toCur = fx.settings.to; // message.to || fx.settings.to;

                result = format(fx(num).from(fromCur).to(toCur));

                bot.reply(message, result + " " + toCur);
            }
            else { // Shorthand conversion with implied currencies
                bot.reply(message, (fx(num)));
            }
        }
        catch (err) {
            bot.reply(message, err);
        }
    });
});
// <=

//=> Inflector
// Conjugates a verb
controller.hears(["^conjugate (.*)$"], ["direct_message", "direct_mention"], function(bot, message) {
    try {
        if (message.match[1].indexOf("to ") !== -1) {
            bot.reply(message, "Oops, you used the wrong syntax. Try `conjugate [infinitive without \"to\"]`.");
        }
        else {
            bot.reply(message, inflector.conjugate(message.match[1]));
        }
    }
    catch (err) {
        bot.reply(message, err);
    }
});
// <=

// This goes by the end of the file; it works as an "else" function for listener events.
controller.hears(".*", ["direct_message", "direct_mention"], function(bot, message) {
    bot.reply(message, "Sorry <@" + message.user + ">, I don\'t understand. \n");
});
