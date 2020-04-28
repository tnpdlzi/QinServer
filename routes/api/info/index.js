const router = require('express').Router()
const controller = require('./info.controller')

router.post('/search', controller.search)
router.post('/get', controller.get)


module.exports = router