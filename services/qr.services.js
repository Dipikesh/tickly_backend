const QRCode = require("qrcode");
const QRCodeModel = require("../models/qr.model");
const { uploadQRCode } = require("./upload.services");
const { createCanvas, loadImage, Image } = require("canvas");

exports.generateQR = async (
  originalURL,
  myColor,
  center_image,
  width = 150,
  cwidth = 50
) => {
  try {
    console.log({ originalURL, myColor, center_image, width, cwidth });

    const options = {
      color: {
        dark: myColor ? myColor : "#000000",
        light: "#FFFFFF",
      },
      margin: 1,
      errorCorrectionLevel: "H", // Set the error correction level to high
    };

    // const canvas = createCanvas(width, width);
    // const buffer = center_image.toBuffer("image/png");
    //    const buffer = await QRCode.toBuffer(originalURL, options);
    //     const imageUrl = await uploadQRCode(buffer);
    //     console.log({ imageUrl });
    let buffer;
    if (center_image) buffer = await create(originalURL, myColor, center_image, 140, 40);
    else buffer = await QRCode.toBuffer(originalURL, options);

    const imageUrl = await uploadQRCode(buffer);
    console.log({ imageUrl });
    const qrCode = new QRCodeModel({
      url: originalURL,
      image: imageUrl,
    });

    const qrDocument = await qrCode.save();
    return qrDocument;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
// const qrcode = require("qrcode");


async function create(dataForQRcode, myColor, center_image, width, cwidth) {
 
  const canvas = createCanvas(width, width);
  QRCode.toCanvas(canvas, dataForQRcode, {
    errorCorrectionLevel: "H",
    margin: 1,
    color: {
      dark: myColor ? myColor : "#0000ff",
      light: "#ffffff",
    },
  });

  const ctx = canvas.getContext("2d");
  const img = await loadImage(center_image);
  const center = (width - cwidth) / 2;
  ctx.drawImage(img, center, center, cwidth, cwidth);
  const buffer = canvas.toBuffer("image/png");
  //    const buffer = await QRCode.toBuffer(originalURL, options);
  return buffer;
}

// async function createQRImage() {
//   const qrCode = await create(
//     "http://shauryamuttreja.com/qr/",
//     "",
//     "https://firebasestorage.googleapis.com/v0/b/url-shortner-384915.appspot.com/o/letter-x-eagle-logo-with-creative-eagle-head-illustration-vector.jpg?alt=media&token=56c20588-3329-401c-926e-cf88faa85e12",
//     150,
//     50
//   );

//   console.log(qrCode);
// }
// createQRImage();
