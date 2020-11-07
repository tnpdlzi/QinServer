const router = require('express').Router() 
const controller = require('./friend.controller')

router.get('/friendList', controller.friendList)
router.get('/friendProfile', controller.friendProfile)
router.get('/myProfile', controller.myProfile)

module.exports = router;