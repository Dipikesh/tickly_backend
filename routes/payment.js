const express = require("express");
const router = express.Router();

const {
    createPayment
} = require("../controllers/payment");


router.get("/payment", createPayment);
// router.get("/auth/google/callback", validateSignupCallback);
module.exports = router;
