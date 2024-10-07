const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const jwt = require("jsonwebtoken");
const { passport, jwtOptions } = require("../jwtConfig");

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
    .then((user) => {
      const token = jwt.sign(
        {
          _id: user._id,
          email: email,
        },
        jwtOptions.secretOrKey,
        { expiresIn: 60 * 60 }
      );

      console.log("token", token);
      res.status(200).json({ token, user });
    })
    .catch((error) => {
      console.error(error);
      res.status(404).send("Failed to login user - " + error);
    });
});

router.get(
  "/test",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("OK");
  }
);

module.exports = router;
