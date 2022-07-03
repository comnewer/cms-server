const Router = require("koa-router")
const router = new Router();

router.get('/',async ctx => {
    ctx.body='webdata';
})
router.get('/list',async ctx => {
    ctx.body='weblist';
})

module.exports=router;