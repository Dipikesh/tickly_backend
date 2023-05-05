const URL = require("../models/url");
const User = require("../models/user");
const QRCodeService = require("../services/qr.services");
const validUrl = require("valid-url");
const shortid = require("shortid");
const customUrlService = require("../services/customUrl.services");
const { getAnalytics } = require("../services/analytics.services");

exports.shortenURL = async (req, res) => {
  console.log("user shorten URL");

  let user = 0;
  if (req.params && req.params.userId) {
    user = await User.findOne({ _id: req.params.userId });
  }
  const { originalUrl } = req.body;
  const baseUrl = process.env.baseURL;

  if (!validUrl.isUri(baseUrl)) {
    return res.status(400).json({
      error: "Invalid base url",
    });
  }

  let customUrl = 0;
  if (req.body.customUrl)
    customUrl = await customUrlService.genHalfCustom(req.body.customUrl);
  if (customUrl === 3)
    return res.status(400).json({
      error: "Custom Url already exists",
    });

  let qrCode = 0;
  if (req.body.qr === 1) {
    let centerImage = req.body.centerImage;
    let width = req.body.width;
    let cwidth = req.body.cwidth;
    qrCode = await QRCodeService.generateQR(
      originalUrl,
      req.body.color ? req.body.color : 0,
      centerImage,
      width,
      cwidth
    );
  }

  const urlCode = customUrl ? customUrl : shortid.generate();

  if (validUrl.isUri(originalUrl)) {
    try {
      let shortUrl;
      shortUrl = baseUrl + "/" + urlCode;

      const url = new URL({
        originalUrl,
        shortUrl,
        urlCode,
        date: new Date(),
      });

      const data = await url.save();
      console.log(data);
      if (user) {
        user.links.push(data);
        qrCode && user.qr.push(qrCode);
        await user.save();
      }

      res.json({ url, qrCode });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Server Error",
      });
    }
  } else {
    res.status(400).json({
      error: "Invalid Url",
    });
  }
};

exports.publicShortenURL = async (req, res) => {
  const { originalUrl } = req.body;
  const baseUrl = process.env.baseURL;

  if (!validUrl.isUri(baseUrl)) {
    return res.status(400).json({
      error: "Invalid base url",
    });
  }
  let qrCode;
  if (req.body.qr === 1) {
    qrCode = await QRCodeService.generateQR(originalUrl);
    console.log(qrCode);
  }
  const urlCode = shortid.generate();

  if (validUrl.isUri(originalUrl)) {
    try {
      let url = await URL.findOne({ originalUrl });

      if (url) {
        res.json(url);
      } else {
        const shortUrl = baseUrl + "/" + urlCode;

        url = new URL({
          originalUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        });

        await url.save();

        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "Server Error",
      });
    }
  } else {
    res.status(400).json({
      error: "Invalid Url",
    });
  }
};

exports.redirectURL = async (req, res) => {
  try {
    const url = await URL.findOne({ urlCode: req.params.code });
    
    if (url) {
      const data = await getAnalytics(req);
      // return res.send(data)
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({
        error: "No URL Found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
};
