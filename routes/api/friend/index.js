const router = require('express').Router() 
const controller = require('./friend.controller')

router.get('/myProfile', controller.myProfile)
router.get('/friendProfile', controller.friendProfile)

router.get('/profileGame', controller.profileGame)
router.get('/profileGenre', controller.profileGenre)

router.post('/insertProfileGame', controller.insertProfileGame)
router.post('/insertProfileGenre', controller.insertProfileGenre)

router.get('/gameList', controller.gameList)
router.get('/genreList', controller.genreList)

router.get('/tierData', controller.tierData)

router.post('/editIntro', controller.editIntro)
router.post('/editProfileGame', controller.editProfileGame)
router.post('/editProfileGenre', controller.editProfileGenre)

router.post('/deleteProfileGame', controller.deleteProfileGame)
router.post('/deleteProfileGenre', controller.deleteProfileGenre)

router.get('/checkChatList', controller.checkChatList)

module.exports = router;