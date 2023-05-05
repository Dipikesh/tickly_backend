const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const qs = require("qs");
const axios = require("axios");
const userService = require('../services/user.services')

//signup controller
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: `${errors.array()[0].msg}`,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to store user in database",
      });
    }
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  });
};

//login controller
exports.login = (req, res) => {
  const errors = validationResult(req);

  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: `${errors.array()[0].msg}`,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Email does not exist",
      });
    }
    if (user.signup_type === "google") {
      return res.status(400).json({
        error: "Please login with google",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Incorrect password",
      });
    }

    //create token
    const token = jwt.sign({ _id: user.id }, process.env.SECRET);

    //cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //response to frontend
    const { _id, username, email, links } = user;
    return res.json({ token, user: { _id, username, email, links } });
  });
};

//logout controller
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "logout successfully!",
  });
};

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

// //custom middleware
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.signupWithGoogle = async (req, res, next) => {
  try {
    const googleRedirectUrl =
      process.env.NODE_ENV === "production"
        ? `https://analytics-api.markopolo.ai/auth/google/callback`
        : `http://localhost:5000/auth/google/callback`;
    const options = {
      redirect_uri: googleRedirectUrl,
      client_id: process.env.CLIENT_ID,
      access_type: "offline",
      // state:`[${brandId}__123,${redirectUri}]`,
      response_type: "code",
      prompt: "consent",
      scope: [
        "email",
        "profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "openid",
      ].join(" "),
    };
    const qs = new URLSearchParams(options);
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${qs.toString()}`;
    return res.redirect(url);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
exports.validateSignupCallback = async (req, res, next) => {
  try {
    const { code, state } = req.query;
    console.log("redirect uri", process.env.REDIRECT_URI);
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    // Decode and verify the ID token to get user info
    const userInfo = JSON.parse(
      Buffer.from(response.data.id_token.split(".")[1], "base64").toString(
        "ascii"
      )
    );

    // Extract user info from the decoded ID token
    const { sub, name, email } = userInfo;
    console.log("User", userInfo);
      
    // Check if user already exists
    const userData = await userService.createUser(userInfo);
    console.log("data", data);

     const token = jwt.sign({ _id: user.id }, process.env.SECRET);

    //cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //response to frontend
    const { _id, username, links } = userData;
    return res.json({ token, user: { _id, username, email, links } });
 
    // Return the user info
    const url = process.env.NODE_ENV !== "production" ? `http://localhost:3000/dashboard` : '';
    return res.redirect('http://localhost:3000/dashboard')

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
