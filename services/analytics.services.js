const axios = require("axios");
const useragent = require("user-agent");
const DeviceDetector = require("node-device-detector");
// const MobileDetect = require("mobile-detect");
const UAParser = require("ua-parser-js");
const URL = require("../models/url");
exports.getAnalytics = async (req) => {
  try {
    const IPSTACK_API_KEY = "2dafb453d7cf0ac430a78c58264a5133";
    // const ip = "104.28.210.142";
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Use GeoIP to get the geographic location of the IP address
    //  const geo = geoip.lookup(ip);

    // Use user-agent parser to get information about the client's device
    const ua = req.headers["user-agent"];
    //     const parser = new UAParser(ua);
    // const result = parser.getResult();
    // const device = result.device.model || "Unknown";
    // const os = result.os.name || "Unknown";
    // const browser = result.browser.name || "Unknown";

    // console.log(
    //   `Device: ${device}, OS: ${os}, Browser: ${browser}`
    // );

    //     console.log("Hi to " + req.device.type.toUpperCase() + " User");
    // Log the link analytics
    console.log(`IP address: ${ip}`);
    //  console.log(`Geographic location: ${geo.country}`);
    //     console.log(`Device: ${device}`);
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false,
    });
    const userAgent = ua;
    const result = detector.detect(userAgent);
    console.log("result parse", result);
    const url = `http://api.ipstack.com/${ip}?access_key=${IPSTACK_API_KEY}`;
    // & fields=ip, country_name, region_name, city, zip, type, continent_name, location.country_flag, location.country_flag_emoji, location.latitude, location.longitude, location.time_zone`;

    const userData = await axios.get(url);
          console.log({ result: userData.data });
          const urlCode = req.params.code;
          await URL.findOneAndUpdate({ urlCode: req.params.code }, { $push: { analytics: { location: userData.data, device: result, clicks: 1 } } });

    return { location: userData.data, device: result };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
