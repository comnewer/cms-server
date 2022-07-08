const Router = require("koa-router");
const {returnMsg, queryFn} = require("../../../util");
const router = new Router();

//获取文章列表
router.get('/',async (ctx) => {
    let sql = 'SELECT id,title,subTitle,date FROM article';
    let res = await queryFn(sql);
    ctx.body = returnMsg(0,'文章列表获取成功',res);
})
router.post('/', async (ctx) => {
    //获取文章数
    const sql_count = 'SELECT COUNT(*) ROWS FROM article';
    const res_count = await queryFn(sql_count);
    //console.log(res_count);
    const total = res_count[0].ROWS;
    //current 为当前页码, counts 为每前页文章数
    const {current, counts} = ctx.request.body;
    if(!(current>0) || !counts){
        returnMsg(1,'参数缺失');
        return;
    }
    //从数据库中获取文章
    const sql_getarticles = `SELECT id,title,subTitle,date FROM article LIMIT ${(current-1)*counts},${counts}`;
    const res_articles = await queryFn(sql_getarticles);
    ctx.body = returnMsg(0, '分页查询成功', {
        current,counts,total,arr:res_articles
    });
})

module.exports=router;