const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

router.post("/register", (req, res) => {
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

router.post("/login", (req, res) => {
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

module.exports = router;
