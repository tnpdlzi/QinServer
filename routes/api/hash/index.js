const router = require('express').Router();
const hash_controller = require('./hash_controller');


router.post('/hashSearch', hash_controller.hashSearch);
router.post('/roomCreate', hash_controller.roomCreate);
//router.post('/usedHash', hash_controller.usedHash); //에러나서 잠깐 주석처리
module.exports = router;