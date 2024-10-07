const passport = require("passport");
const passportJWT = require("passport-jwt");

// JSON Web Token Setup
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

// Configure its options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: "datasense-backend-secret",
};

const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log("payload received", jwt_payload);

  if (jwt_payload) {
    // The following will ensure that all routes using
    // passport.authenticate have a req.user._id, req.user.email, req.user.fullName & req.user.role values
    // that matches the request payload data
    console.log("###### jwt payload", jwt_payload);
    next(null, {
      _id: jwt_payload._id,
      email: jwt_payload.email,
      // role: jwt_payload.role,
    });
  } else {
    next(null, false);
  }
});

passport.use(strategy);

module.exports = {
  passport,
  jwtOptions,
};
