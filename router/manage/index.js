const Router = require("koa-router");
const {query} = require("../../util");
const login = require("./login");
const register = require("./register");
const info = require("./info");
const upload = require("./upload");
const router = new Router();


router.get('/',async ctx => {
    ctx.body='cms-server';
})

router.use('/login', login.routes(), login.allowedMethods());
router.use('/register', register.routes(), register.allowedMethods());
router.use('/info', info.routes(), info.allowedMethods());
router.use('/upload', upload.routes(), upload.allowedMethods());
module.exports=router;
