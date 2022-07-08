const Router = require("koa-router");
const {returnMsg, queryFn, jwtVerify} = require("../../../util");
const router = new Router();

//根据id获取文章
router.get('/:id', async ctx => {
    //鉴权
    const token = ctx.request.headers["cms-token"];
    if(!jwtVerify(token)){
        //鉴权失败
        ctx.body=returnMsg('2','查询失败','token过期或用户不存在');
        return;
    }
    //鉴权成功
    //根据id查询文章
    const id = ctx.url.split('/')[ctx.url.split('/').length-1];
    const sql_getArticle = `SELECT * FROM article WHERE id=${id}`;
    const res_getArticle = await queryFn(sql_getArticle);
    //返回查询结果
    if(res_getArticle.length>0)
        ctx.body = returnMsg(0,'文章获取成功',res_getArticle[0]);
    else
        ctx.body = returnMsg(1,'文章不存在或已被删除');
})

module.exports=router;