const Router = require("koa-router");
const {returnMsg, queryFn, jwtVerify} = require("../../util");


const router = new Router();

//查询用户信息
router.get('/', async ctx => {
    //获取token
    let token = ctx.request.headers['cms-token'];

    //鉴权
    if(!jwtVerify(token)){
        //鉴权失败
        ctx.body=returnMsg('2','查询失败','token过期或用户不存在');
        return;
    }
    //鉴权成功
    //sql语句
    let sql = `SELECT username,token,avatar FROM user WHERE token='${token}'`;
    //查询
    let res = await queryFn(sql);
    ctx.body=res[0];
})

//修改用户信息
router.post('/',async ctx => {
    //获取token
    let token = ctx.request.headers['cms-token'];
    //鉴权
    if(!jwtVerify(token)){
        //鉴权失败
        ctx.body=returnMsg('2','查询失败','token过期或用户不存在');
        return;
    }
    //鉴权成功
    //获取参数
    let {username, password} = ctx.request.body;
    //查询是否存在重名用户
    let sql2 = `SELECT username FROM user WHERE username='${username}'`;
    const res_check = await queryFn(sql2);
    if(res_check.length>0){
        //存在重名用户，修改失败
        ctx.body=returnMsg(1,'修改失败','存在重名用户'); 
        return
    }
    //预防参数缺失
    let sql1 = `SELECT username,token,avatar FROM user WHERE token='${token}'`;
    let res2 = await queryFn(sql1);
    //修改用户信息
    let sql = `UPDATE user SET username='${username||res2[0].username}',password='${password||res2[0].password}' WHERE token='${token}'`;
    await queryFn(sql);
    let sql_search = `SELECT username,token,avatar FROM user WHERE token='${token}'`;
    //查询修改结果，并返回修改结果
    let res = await queryFn(sql_search);
    ctx.body=returnMsg(0,'修改成功',{
        username: res[0].username,
        'cms-token': res[0].token,
        avatar: res[0].avatar,
    });    
})

module.exports=router;