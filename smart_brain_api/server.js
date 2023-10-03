//server.js

const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

//define locations of route components
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const { handleApiCall, handleImage  } = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    port: 5432,
    password: "SQLPassX&7",
    database: "smart_brain",
  },
});

db.select("*")
  .from("users")
  .then((data) => {});

const app = express();

//need the json parser module that is contained here for express to interpret JSON.
// using express.json instead of the body parser module.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
//this is the database that we will be comparing with.

app.get("/", (req, res) => {
  res.send("success");
});

//sign in post module, compares with database email and password for a validation check.
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
}); // we're injecting the dependencies into the register.js

//the syntax below ':id' allows for the get request to use params
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

//this will keep count of the user image submissions
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

// Create a new endpoint for handling image URL requests
app.post("/imageurl", (req, res) => {
  const { imageUrl } = req.body;

  // Call the handleApiCall function to process the image URL
  handleApiCall(imageUrl)
    .then((regions) => {
      // Send the regions data as JSON
      res.json({ boxes: regions });
    })
    .catch((error) => {
      console.log('Error handling image URL:', error);
      res.status(500).json({ error: 'Image URL processing failed' });
    });
});

//npm listener for changes/debugging.
app.listen(3000, () => {
  console.log("App is running on port 3000");
});
