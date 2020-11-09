const router = require('express').Router() // express의 라우터 함수 사용. controller에서 작성한 모듈들을 한번에 export 해줄 수 있음
const controller = require('./user.controller') // user.controller에 있는 exports 된 모듈들을 쓰겠다는 뜻


router.post('/search', controller.search) // 컨트롤러에서 search로 exports된 애들을 /search url로 배정 방식은 post
router.get('/getMyDatas', controller.getMyDatas) // get이라는 모듈을 get방식으로 url 배정
router.post('/register', controller.register) // 동일
router.get('/login', controller.login)
router.post('/gameInfo_change', controller.gameInfo_change)
router.post('/searchName', controller.searchName)
router.post('/searchID', controller.searchID)
router.post('/searchAns', controller.searchAns)
router.post('/searchPhone', controller.searchPhone)
router.post('/passID', controller.passID)
router.post('/updatePW', controller.updatePW)
router.post('/search_ID', controller.search_ID)
router.post('/searchQuestion', controller.searchQuestion)
router.post('/emailAuth', controller.emailAuth)


module.exports = router; // 위의 애들 한번에 exports
