const Router = require("koa-router");
const {returnMsg, queryFn, jwtVerify} = require("../../../util");
const moment = require("moment");
const router = new Router();

//文章编辑
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
    if(res_editable[0].editable){
        //有编辑权限
        //从请求获取参数
        const {id, title, subTitle, content} = ctx.request.body;
        //必要参数检查
        if(!id||!title){
            ctx.body=returnMsg('1','参数缺失');
            return;
        }
        //检查修改文章是否存在
        const sql_check = `SELECT * FROM article WHERE id=${id}`;
        const res_check = await queryFn(sql_check);
        if(res_check.length>0){
            //文章存在，修改文章
            //修改时间
            let datetime = moment().format('YYYY-MM-DD HH:mm:ss')
            const sql_edit = `UPDATE article SET title='${title}',subTitle='${subTitle||''}',date='${datetime}',content='${content||''}',author='${res_editable[0].username}' WHERE id=${id}`
            await queryFn(sql_edit);
            //修改完成，返回修改后的列表
            let sql = `SELECT id,title,subTitle,date FROM article WHERE id=${id}`;
            let res = await queryFn(sql);
            ctx.body = returnMsg(0,'文章修改完成',res[0]);
        }else{
            ctx.body=returnMsg('1','当前文章不存在');
            return;    
        }
    }else{
        //无编辑权限
        ctx.body=returnMsg('1','用户无编辑权限');
        return;
    }
});

module.exports=router;