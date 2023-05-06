const url = require("../models/url");
const User = require("../models/user");
const QRCode = require("../models/qr.model")

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

exports.generateQR = async (req, res) => { 
  try {
    
  }
  catch (error) {
    res.status(400).json({
      error: "Failed to generate QR Code",
    });
  }
}

exports.getLinkDetails = async(req,res)=>{
  try{
    // console.log({datas:req.query})
    // console.log({datas:req.body})
    let links = await url.findOne({ _id: req.query._id });
    // const qrIds = await User.findOne({_id:req.params.userId},{qr:1});
    
    // // console.log("qrIds",qrIds.qr)
    // const qr = await QRCode.find({ _id: { $in: qrIds.qr } });
    // console.log("qr",qrs)
    
    if (!links) {
      return res.status(200).json({
        error: "No Links Details Found",
      });
    }

    return res.status(200).send(links);
  }
  catch(err){
    console.log(err)
      res.status(400).json({
        error:"Failed to get link data"
      })
  }
}