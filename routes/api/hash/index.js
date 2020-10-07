const router = require('express').Router();
const hash_controller = require('./hash_controller');

router.post('/hashSearch', hash_controller.hashSearch);
router.post('/roomCreate', hash_controller.roomCreate);
router.get('/topRank', hash_controller.topRank);
router.post('/chatRoomEnter', hash_controller.chatRoomEnter);


module.exports = router;