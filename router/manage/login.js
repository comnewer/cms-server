const Router = require("koa-router");
const {returnMsg, queryFn} = require("../../util");
const jwt = require("jsonwebtoken");

const router = new Router();

router.post('/',async ctx => {
    let {username, password} = ctx.request.body;

    if(!(username&&password)){
        //参数丢失
        ctx.body = returnMsg(1, '登陆失败', '参数错误');
    }else{
        //在数据库中查询用户
        let sql = `SELECT * FROM user WHERE username='${username}'`;
        let res = await queryFn(sql);
        
        if(res.length>0){
            //用户存在
            // 根据username和password生成token
            let token=jwt.sign(
                {username,password},    // 携带信息
                'zhaowenxian',          // 秘钥
                {expiresIn:'1h'}        // 有效期：1h一小时
            )

            let sql_token = `UPDATE user SET token='${token}' WHERE username='${username}'`
            await queryFn(sql_token);
            let res_saved = await queryFn(sql);
            let userInfo = {
                username: res_saved[0].username,
                'cms-token': res_saved[0].token,
                avatar: res_saved[0].avatar,
            }
            ctx.body = returnMsg(0, '登陆成功', userInfo);
        }else{
            //用户不存在
            ctx.body = returnMsg(2, '登陆失败','用户不存在');
        }   
    }
})

module.exports=router;