Ask not for whom the bot quacks—he quacks for thee!

This project used to live at https://github.com/keagud/Quackbot, but now it lives at https://github.com/wyattscarpenter/quackbot.

You may invite this bot to your server/user with https://discord.com/oauth2/authorize?client_id=1390873534162796674

Make a file secret.json at the root of this project directory, with contents like `{"token": "fdskjlsdfjklfdsakljdfsakljdfslkj"}`, where the value of the token key-value pair is the bot secret from your app in https://discord.com/developers/applications, to let the bot run non-locally. Otherwise it will just run a local repl.

Note that this key I mention is (at time of writing) the 32-character "client secret" from the /oauth2 "OAuth2" tab of the application dashboard, not the tempting and seductive 64-character "Public Key" from the /information "General Information" tab of the application dashboard.

I currently get a `Error [TokenInvalid]: An invalid token was provided.` error from the internals of discord.js whenever I try to use a perfectly-valid, freshly-minted token, which is annoying, so I stopped trying.

.github/workflows/deploy.yml contains some hints as to what you have to do to deploy quackbot, although it's also mixed up in a bunch of unnecessarily complex commands that manipulate a computer it used to run on that is no longer even online. So, there's that. If you figure this out, please make a pull request with what you find. (Bonus points if you document, eg, the DEPLOY_FLAG env var, here in this readme.) I haven't gotten rid of any of the parts of the workflow in case that would accidentally make it more mysterious, but the actual solution should be pretty simple; like, probably just the "Register slash commands" and "Run for deployment" steps (plus probably the typescript step). However, I have not been able to test it, due to the TokenInvalid thing above. & lack of spare time in which to right this.

Another thing that could be improved about this project (although I am unlikely to do so) is using https://github.com/bloomberg/ts-blank-space to run the bot during development, as waiting for tsc is annoyingly slow (or, something is slow, and I assume it's tsc). Tsc would continue to be used for full-start. I also tried swc, and just running node on the code directly since apparently it can handle typescript directly now, but each time I got ERR_MODULE_NOT_FOUND for importing util, I guess because it needs a file extension now. So I didn't think about it much after that.
