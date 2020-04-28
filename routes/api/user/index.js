const router = require('express').Router()
const controller = require('./user.controller')

router.post('/search', controller.search)
router.get('/get', controller.get)
router.post('/register', controller.register)
router.post('/login', controller.login)


module.exports = router;