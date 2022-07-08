const Router = require("koa-router");
const {returnMsg, queryFn, jwtVerify} = require("../../../util");
const router = new Router();

//删除文章
router.post('/', async ctx => {
    //鉴权
    const token = ctx.request.headers["cms-token"];
    if(!jwtVerify(token)){
        //鉴权失败
        ctx.body=returnMsg('2','查询失败','token过期或用户不存在');
        return;
    }
    //鉴权成功
    //获取参数
    const {id} = ctx.request.body;
    //参数检测
    if(!id){
        ctx.body = returnMsg(1,'参数缺失');
        return;
    }
    //编辑权限检测
    const sql_checkEditable = `SELECT editable FROM user WHERE token='${token}'`;
    const res_editable = await queryFn(sql_checkEditable);
    if(!res_editable[0].editable){
        ctx.body = returnMsg(1,'无编辑权限');
        return
    } 
    //文章是否存在
    const sql_check = `SELECT * FROM article WHERE id=${id} `;
    const res_check = await queryFn(sql_check);
    if(!(res_check.length>0)){
        ctx.body = returnMsg(1,'目标不存在');
        return;
    } 
    //删除文章
    const sql_del = `DELETE FROM article WHERE id=${id}`;
    await queryFn(sql_del);
    ctx.body = returnMsg(0,'删除成功');
})

module.exports=router;