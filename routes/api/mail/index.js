const router = require('express').Router() 
const controller = require('./mail.controller') 


router.get('/evalMail', controller.evalMail)


module.exports = router; 
