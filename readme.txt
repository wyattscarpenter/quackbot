Ask not for whom the bot quacks—he quacks for thee!

This project used to live at https://github.com/keagud/Quackbot, but now it lives at https://github.com/wyattscarpenter/quackbot.

You may invite this bot to your server/user with https://discord.com/oauth2/authorize?client_id=1390873534162796674

Make a file secret.json at the root of this project directory, with contents like `{"token": "fdskjlsdfjklfdsakljdfsakljdfslkj"}`, where the value of the token key-value pair is the bot secret from your app in https://discord.com/developers/applications, to let the bot run non-locally. Otherwise it will just run a local repl.

I currently get a `Error [TokenInvalid]: An invalid token was provided.` error from the internals of discord.js whenever I try to use a perfectly-valid, freshly-minted token, which is annoying, so I stopped trying.

.github/workflows/deploy.yml contains some hints as to what you have to do to deploy quackbot, although it's also mixed up in a bunch of unnecessarily complex commands that manipulate a computer it used to run on that is no longer even online. So, there's that.
