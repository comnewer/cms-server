const Router = require("koa-router");
const {returnMsg, queryFn, jwtVerify} = require("../../util");
const router = new Router();
//获取小编列表
router.get('/', async ctx => {
    //鉴权
    const token = ctx.request.headers["cms-token"];
    if(!jwtVerify(token)){
        //鉴权失败
        ctx.body=returnMsg('2','查询失败','token过期或用户不存在');
        return;
    }
    //鉴权成功
    const sql_userlist = "SELECT id,username,avatar,editable FROM user WHERE player='normal'";
    const res_users = await queryFn(sql_userlist);
    ctx.body = returnMsg(0,'列表请求成功',res_users);
})

//修改用户列表
router.post('/', async ctx => {
    //鉴权
    const token = ctx.request.headers["cms-token"];
    if(!jwtVerify(token)){
        //鉴权失败
        ctx.body=returnMsg('2','查询失败','token过期或用户不存在');
        return;
    }
    //鉴权成功
    //从请求获取参数
    const {id, open} = ctx.request.body;
    //必要参数检查
    if(!id){
        ctx.body=returnMsg('1','参数缺失');
        return;
    }
    //编辑权限检测
    const sql_checkEditable = `SELECT editable FROM user WHERE id='${id}'`;
    const res_editable = await queryFn(sql_checkEditable);
    if(res_editable[0].editable===1 && open===1){
        ctx.body = returnMsg(2,'该用户已有编辑权限');
        return
    } 
    if(res_editable[0].editable===0 && open===0){
        ctx.body = returnMsg(2,'该用户未有编辑权限');
        return
    }
    //修改用户编辑权限
    const sql = `UPDATE user SET editable=${open} WHERE id=${id}`;
    await queryFn(sql);
    ctx.body = returnMsg(0,'修改成功');
})

module.exports=router;