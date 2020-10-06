const router = require('express').Router() // express의 라우터 함수 사용. controller에서 작성한 모듈들을 한번에 export 해줄 수 있음
const controller = require('./category.controller') // user.controller에 있는 exports 된 모듈들을 쓰겠다는 뜻


router.get('/roomlist', controller.roomlist)
router.get('/myroom', controller.myroom)
router.get('/refresh', controller.refresh)
router.get('/title', controller.title)
router.get('/member', controller.member)
router.post('/join', controller.join)
router.post('/makeRoom', controller.makeRoom)


module.exports = router; // 위의 애들 한번에 exports
