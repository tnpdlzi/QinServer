const router = require('express').Router() 
const controller = require('./friend.controller')

router.get('/friendList', controller.frinedList)

module.exports = router;