const router = require('express').Router() 
const controller = require('./friend.controller')

router.get('/friendList', controller.friendList)
router.get('/friendProfile', controller.friendProfile)

module.exports = router;