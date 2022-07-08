const Router = require("koa-router");
const {returnMsg, queryFn, jwtVerify} = require("../../../util");
const moment = require("moment");
const router = new Router();

//文章添加
router.post('/', async ctx => {
     //鉴权
     const token = ctx.request.headers["cms-token"];
     if(!jwtVerify(token)){
         //鉴权失败
         ctx.body=returnMsg('2','查询失败','token过期或用户不存在');
         return;
     }
     //鉴权成功
     //查询用户是否有编辑权限
     const sql_editable = `SELECT editable,username FROM user WHERE token='${token}'`;
     const res_editable = await queryFn(sql_editable);
     if(!res_editable[0].editable){
        //无编辑权限
        ctx.body=returnMsg('1','用户无编辑权限');
        return;
     }
     //有编辑权限
     //从请求获取参数
    const {title, subTitle, content} = ctx.request.body;
    //必要参数检查
    if(!title||!content){
        //参数缺失
        ctx.body=returnMsg('1','参数缺失');
        return;
    }
    //获取添加时间
    let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    //获取添加这名字
    const author = res_editable[0].username;
    const sql_add = `INSERT INTO article VALUES(null,'${title}','${subTitle||''}','${author}','${datetime}','${content||""}')`;
    await queryFn(sql_add);
    ctx.body = returnMsg(0,'文章添加成功');
})

module.exports=router;