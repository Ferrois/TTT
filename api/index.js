require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const mongoose = require("mongoose");
const server = require("http").createServer(app);
const axios = require("axios");
const UserSchema = require("./models/user.js");

const clientURI = process.env.clientURI ||'http://localhost:5173'
const dbURI = process.env.dbURI;
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;

// Connect to MongoDB
mongoose.connect(`${dbURI}`).then((response) => {
  console.log("Connected to MongoDB. Link: " + response.connection.host);
});

app.use(
  cors({
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.get("/test", (req, res) => {
  res.json("This string was sent by the server.");
});

app.get("/auth", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(500).json("Invalid Authentication Attempt.");
  try {
    const {
      data: { athlete, refresh_token, access_token, expires_at },
    } = await axios.post(
      `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`
    );
    // Check if existing user exists.
    const existingUser = await UserSchema.find({ athlete_id: athlete.id }).exec();

    // Clause: Existing user exists.
    if (existingUser.length != 0) {
      await UserSchema.findOneAndUpdate({ athlete_id: athlete.id }, { refresh_token, access_token, token_expires_at: expires_at });
      const queryParams = new URLSearchParams({
        r: refresh_token,
        a: access_token,
        id: existingUser[0]._id,
        e: expires_at,
      }).toString();

      return res.redirect(`${clientURI}/home?${queryParams}`);
    }

    // Clause: Existing user does not exist: Create new user
    const newUser = new UserSchema({
      username: athlete.username,
      firstname: athlete.firstname,
      athlete_id: athlete.id,
      refresh_token,
      access_token,
      token_expires_at: expires_at,
    });

    // Save new user to database
    try {
      const savedUser = await newUser.save();
      const queryParams = new URLSearchParams({
        r: savedUser[0].refresh_token,
        a: savedUser[0].access_token,
        id: savedUser[0]._id,
        e: savedUser[0].token_expires_at,
      }).toString();
      return res.redirect(`${clientURI}/home?${queryParams}`);
    } catch (e) {
      return res.status(500).json("Unable to register user on to the database. Please try again!");
    }

    // return res.json(response.data);
  } catch (e) {
    return res.json(["Invalid Code: Error fetching data from Strava.", e]);
  }
});

app.get("/user", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json("Invalid Authentication Credentials");
    const existingUser = await UserSchema.find({ _id: userId }).exec();
    if (existingUser.length == 0) return res.status(400).json("User data not found");
    let { access_token: accessToken, refresh_token: refreshToken, token_expires_at: expiresAt } = existingUser[0];
    // Clause: needs a new refresh and access token
    if (Math.ceil(Date.now() / 1000) > expiresAt) {
      const {
        data: { refresh_token, access_token, expires_at },
      } = await axios.post(
        `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`
      );
      await UserSchema.findOneAndUpdate({ _id: userId }, { access_token, refresh_token, token_expires_at: expires_at });
      accessToken, refreshToken, (expiresAt = access_token), refresh_token, expires_at;
    }
    const userData = await axios.get(`https://www.strava.com/api/v3/athlete?access_token=${accessToken}`);
    const userActivities = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities?per_page=10&access_token=${accessToken}`
    );
    return res.json({ userActivities: userActivities.data, userData: userData.data });
  } catch (e) {
    // console.log(e);
    return res.status(500).json("Something went wrong...");
  }
});

//Listen on the port
server.listen(port, function () {
  console.log("Server started on port " + port);
});
