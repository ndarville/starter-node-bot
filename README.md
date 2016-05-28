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
npm install
SLACK_TOKEN=<YOUR_SLACK_TOKEN> npm start
```

Things are looking good if the console prints something like:

    ** API CALL: https://slack.com/api/rtm.start
    ** BOT ID:  witty  ...attempting to connect to RTM!
    ** API CALL: https://slack.com/api/chat.postMessage

### Run locally in Docker ###

```sh
docker build -t starter-node .`
docker run --rm -it -e SLACK_TOKEN=<YOUR SLACK API TOKEN> starter-node
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
