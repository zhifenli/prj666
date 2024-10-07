// src/routes/index.js

const express = require("express");
const userService = require("../services/userService");

// Create a router instance for mounting the API
const router = express.Router();

// Simple GET - health check route
router.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Success! Server is running.",
  });
});

// user routes
router.post("/users/register", (req, res) => {
  const { email, password } = req.body; // object destructure
  userService
    .userCreate(email, password)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to create user due to - " + error);
    });
});

router.post("/users/login", (req, res) => {
  // check email/passward-plain, if matches db's email/password-hash, then return a jwt: email, expireAt.
  const { email, password } = req.body; // object destructure
  userService
    .userCheck(email, password)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send("Failed to login user - " + error);
    });
});

// Link routes to route handlers
router.post("/sensor-data", require("./post"));
router.get("/sensor-data", require("./get"));

// Export the router
module.exports = router;
