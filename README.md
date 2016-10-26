Robotto [![Build Status][build-icon]][build-link] [![dependency status][]](https://david-dm.org/ndarville/starter-node-bot#info=dependencies)
=======

## Overview ##

A simple starting point for creating a Beep Boop hostable, Node.js based Slack bot with Botkit.

Visit [Beep Boop][] to get the scoop on the the Beep Boop hosting platform. There is also the [Slack API documentation][].

## Assumptions ##

* You have already signed up with [Beep Boop](https://beepboophq.com) and have a local fork of this project.
* You have sufficient rights in your Slack team to configure a bot and generate/access a Slack API token.

## Usage ##

### Run locally ###

```sh
yarn # or npm install
SLACK_TOKEN=<YOUR_SLACK_TOKEN> GOOGLE_TOKEN=<YOUR_GOOGLE_TOKEN> OXR_TOKEN=<YOUR_OXR_TOKEN> npm start
```

Or, you can export your tokens as environment variables and run

```sh
npm run local
```

If you aren’t planning to use the Google or OXR scripts, you can always just export a dummy environment variable:

```sh
export GOOGLE_TOKEN=foo
export OXR_TOKEN=bar
```

I don’t test the Google translate scripts, because the translation can change from day to day, so I generally just use a dummy environment variable for testing.

After starting `index.js` you should get something like this:

    [nodemon] 1.11.0
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching: *.*
    [nodemon] starting `node index.js`
    info: ** No persistent storage method specified! Data may be lost when process shuts down.
    info: ** Setting up custom handlers for processing Slack messages
    info: ** API CALL: https://slack.com/api/rtm.start
    notice: ** BOT ID: nd ...attempting to connect to RTM!
    notice: RTM websocket opened

I prefer using nodemon to keep re-running the script with every change to catch errors, but you can alter the `start` script in `package.json` if you prefer to.

### Run locally in Docker ###

```sh
docker build -t starter-node .
docker run --rm -it -e SLACK_TOKEN=<YOUR_SLACK_TOKEN> GOOGLE_TOKEN=<YOUR_GOOGLE_TOKEN> OXR_TOKEN=<YOUR_OXR_TOKEN> starter-node
```

### Run in BeepBoop ###

If you have linked your local repo with the Beep Boop service (check the [project list][]), changes pushed to the remote master branch will automatically deploy.

## Acknowledgements ##

This code uses the [Botkit][] npm module by the fine folks at Howdy.ai.

## License ##

See the [LICENSE][] file (MIT).


[build-link]: https://travis-ci.org/ndarville/starter-node-bot
[build-icon]: https://travis-ci.org/ndarville/starter-node-bot.svg
[dependency status]: https://david-dm.org/ndarville/starter-node-bot.svg
[beep boop]: https://beepboophq.com/docs/article/overview
[slack api documentation]: https://api.slack.com
[project list]: https://beepboophq.com/0_o/my-projects
[botkit]: https://github.com/howdyai/botkit
[license]: LICENSE.md
