const { model, Schema } = require("mongoose");

module.exports = model("User", new Schema({
	GuildName: String,
	Guild: String,
	User: String,
	UserTag: String,
	/* Coins: { type: Number, default: 100 },
	Bank: { type: Number }, */

}), "User")