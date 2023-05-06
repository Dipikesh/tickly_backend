const express = require('express')
const router = express.Router()

const { getUserLinks } = require('../controllers/user')
const { isSignedIn, isAuthenticated } = require('../controllers/auth')
const { getUserById ,getLinkDetails} = require('../controllers/user')

router.param('userId', getUserById)

router.get('/urls/:userId', isSignedIn, isAuthenticated, getUserLinks)

router.get('/url-detail/:userId',isSignedIn, isAuthenticated, getLinkDetails);

module.exports = router