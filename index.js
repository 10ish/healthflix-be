const express = require("express");
const serverConfig = require("./config/server.config");
const bodyParser = require("body-parser");
const cors = require("cors");
const adminConfig = require("./config/adminConfig");
// Sample Job Data
const sampleJob = require("./sampleJobData");
const db = require("./models");
const app = express();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const authConfig = require("./config/authConfig");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
//Impoerting models from models
const User = db.User;
const Job = db.Job;
const Application = db.Application
// Cors middleware
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(
  cors({
    origin: ["https://healthflix-fe.vercel.app/"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);

//Connecting to yiur localhist/test db
db.connectDB();
//initializing database
init();
async function init() {
  bcrypt.hash(adminConfig.password, authConfig.salt, async (err, hash) => {
    if (err) {
      console.log("Error hashing password for default admin");
    }
    const defaultAdmin = {
      username: adminConfig.username,
      password: hash,
    };
    try {
      const user = await User.create(defaultAdmin);
      console.log("Sample User created by the name of :" + user);
    } catch (err) {
      console.log("Unable to initialize sample users " + err.message);
    }
  });

  try {
    await Job.deleteMany();
    await User.deleteMany();
  
    console.log("Dropped all entries from Jobs and User model ");
  } catch (err) {}

  try {
    const sampleJobs = await Job.insertMany(sampleJob);

    console.log(`Sample Job inserted `);
  } catch (err) {
    console.log("Unable to initialize sample jobs" + err.message);
  }
}

app.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({});
    const hotJobs = jobs.slice(0, 6);
    res.status(201).send(hotJobs);
  } catch (err) {
    res.status(500).send("Unable to find Jobs due to" + err.message);
  }
});

// Requiring all the routes
require("./routes/jobs.routes")(app);
require("./routes/applicants.routes")(app);
require("./routes/staffingRequest.routes")(app);
require("./routes/user.routes")(app);
require('./routes/applications.routes')(app);

app.listen(serverConfig.PORT, () => {
  console.log("Server Started on " + serverConfig.PORT);
});
