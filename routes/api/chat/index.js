const router = require('express').Router() 
const controller = require('./chat.controller')

router.get('/loadChatList', controller.loadChatList)

module.exports = router;
