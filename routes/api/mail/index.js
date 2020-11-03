const router = require('express').Router() 
const controller = require('./mail.controller') 


router.get('/evalMail', controller.evalMail)
router.get('/getMails', controller.getMails)
router.get('/good', controller.good)
router.get('/bad', controller.bad)
router.get('/deleteMail', controller.deleteMail)
router.post('/sendMails', controller.sendMails)


module.exports = router; 
