const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No User Found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUserLinks = async (req, res) => {
  try {
    const links = await User.findOne({ _id: req.params.userId }).populate("links");
    if (!links) {
      return res.status(200).json({
        error: "No Links Found",
      });
    }
    console.log(links);
    return res.status(200).send(links.links);
  } catch (error) {
    res.status(400).json({
      error: "No URLs Shortened",
    });
  }
};
