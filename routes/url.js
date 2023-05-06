const express = require("express");
const router = express.Router();

const {
  shortenURL,
  publicShortenURL,
  redirectURL,
} = require("../controllers/url");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById,getLinkDetails } = require("../controllers/user");

router.param("userId", getUserById);

//routes for logged in users
router.post("/url/shorten/:userId", isSignedIn, isAuthenticated, shortenURL);

//public route
router.post("/url/shorten", publicShortenURL);

router.get("/url/:userId",isSignedIn,isAuthenticated,getLinkDetails)

// redirect
router.get("/:code", redirectURL);

router.get("/track", (req, res) => {
  
    // Get the IP address of the requesting client
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Use GeoIP to get the geographic location of the IP address
    const geo = geoip.lookup(ip);

    // Use user-agent parser to get information about the client's device
    const userAgent = req.headers["user-agent"];
    const device = useragent.parse(userAgent).device.toString();

    // Log the link analytics
    console.log(`IP address: ${ip}`);
    console.log(`Geographic location: ${geo.country}`);
    console.log(`Device: ${device}`);

    // Send the response
    res.send("Hello World!");
  
});
module.exports = router;
