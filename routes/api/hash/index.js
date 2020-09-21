const router = require('express').Router();
const hash_controller = require('./hash_controller');


router.post('/hashSearch', hash_controller.hashSearch);
router.post('/roomCreate', hash_controller.roomCreate);
router.post('/usedHash', hash_controller.usedHash);
module.exports = router;