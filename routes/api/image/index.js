const router = require('express').Router()
const controller = require('./image.controller')

router.post('/upload', controller.upload)


module.exports = router;