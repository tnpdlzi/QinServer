const router = require('express').Router() 
const controller = require('./friend.controller')

router.get('/friendList', controller.get)

module.exports = router;