// https://api.yourbestbot.pt
const color = require('colors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
const { getTimestamp } = require("../functions/utils.js");
const port = process.env.PORT || 80

// Define the rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 100 requests per `window` (15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware globally
//app.use(limiter);

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

	console.log(color.yellow(`[${getTimestamp()}]`) + ` ${req.method} ${req.url} | ${req.ip}`);

	next();
});

app.options('*', (req, res) => res.status(200).json());

module.exports.load = (client) => {
	app.use(express.json());

	//? THE START
	// dashboard login
	/**
	 * First go to https://api.yourbestbot.pt/oauth and authorize the bot, then
	 * it should redirect to /login and it should be good.
	 */
	app.get('/oauth', (req, res) => require('./oauth.js')(req, res));
	app.get('/login', (req, res) => require('./login.js')(req, res));

	app.get("/commands", (req, res) => require("./commands.js")(req, res, client));
	app.get("/lastfm", (req, res) => require("./lastfm.js")(req, res, client));
	app.get("/membercount/:id", (req, res) => require("./membercount.js")(req, res, client));
	app.get("/servercount/", (req, res) => require("./servercount.js")(req, res, client));
	app.get("/transcript/:ticketid", (req, res) => require("./transcript.js")(req, res));
	app.post("/votes", (req, res) => require("./votes.js")(req, res, client));
	app.use((req, res) => { require('./notfound.js')(req, res, client); });
	app.listen(port)
	console.log(`🚀 ${client.user.username} API is Up and Running!`.brightYellow.bold);
}

/* app.use(express.json());

app.get('/api/membercount/:id', (req, res) => {

	const { id } = req.params;

	res.status(200).send({
		membercount: func
	})

})

app.get('/tshirt', (req, res) => {
	res.status(200).send({
		tshirt: "ss",
		size: "large"
	})
})

app.post('/tshirt/:id', (req, res) => {

	const { id } = req.params;
	const { logo } = req.body;

	if (!logo)
		res.status(418).send({ message: "We need a logo!" });

	res.send({
		tshirt: `tshirt with your ${logo} and ID of ${id}`
	})
}) */
