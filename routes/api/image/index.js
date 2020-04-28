const router = require('express').Router()
const controller = require('./image.controller')

router.post('/get', controller.get)


module.exports = router