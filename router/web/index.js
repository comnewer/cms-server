const Router = require("koa-router")
const {queryFn, returnMsg} = require("../../util");
const router = new Router();

router.get('/',async ctx => {
    ctx.body='webdata';
    
})
//导航栏
router.get('/nav',async ctx => {
    const sql = 'SELECT * FROM nav';
    const nav = await queryFn(sql);
    ctx.body = returnMsg(0,'请求成功',nav);
})
//banner
router.get('/banner',async ctx => {
    const sql = 'SELECT * FROM banner';
    const res = await queryFn(sql);
    ctx.body = returnMsg(0,'请求成功',res);
})
//文章列表
router.get('/list',async ctx => {
    const sql = 'SELECT id,title,author,date FROM article';
    const res = await queryFn(sql);
    ctx.body = returnMsg(0,'请求成功',res);
})
//获取文章
router.get('/article',async ctx => {
    const id = ctx.request.query.id;
    const sql = `SELECT * FROM article WHERE id=${id}`;
    const res = await queryFn(sql);
    ctx.body = returnMsg(0,'请求成功',res[0]);
})
module.exports=router;