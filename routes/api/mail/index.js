const router = require('express').Router() 
const controller = require('./mail.controller') 


router.get('/evalMail', controller.evalMail)
router.get('/getMails', controller.getMails)


module.exports = router; 
