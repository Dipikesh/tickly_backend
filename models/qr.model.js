const mongoose = require("mongoose");
const { Schema } = mongoose;

const qrCodeSchema = new Schema({
  url: String,
  image: String,
});

const QRCode = mongoose.model("QRCode", qrCodeSchema);
module.exports = QRCode;