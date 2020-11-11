const router = require('express').Router() 
const controller = require('./friend.controller')

router.get('/myProfile', controller.myProfile)
router.get('/friendProfile', controller.friendProfile)

router.get('/profileGame', controller.profileGame)
router.get('/profileGenre', controller.profileGenre)

router.post('/insertProfileGame', controller.insertProfileGame)
router.post('/insertProfileGenre', controller.insertProfileGenre)

router.get('/tierData', controller.tierData)

module.exports = router;