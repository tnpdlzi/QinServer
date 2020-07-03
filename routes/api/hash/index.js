const router = require('express').Router();
const hash_controller = require('./hash_controller');


router.post('/hashSearch', hash_controller.chatList);
router.post('/roomCreate', hash_controller.roomCreate);

module.exports = router;