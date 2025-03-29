const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
  },
  realname: {
    type: String,
    default: "Real name not yet defined.",
  },
  role: {
    type: String,
    default: "member"
  },
  athlete_id: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  last_login: {
    type: Number,
    default: Math.ceil(Date.now() / 1000),
  },
  token_expires_at: {
    type: Number,
    default: new Date().getTime(),
  },
});

module.exports = mongoose.model("User", UserSchema);
