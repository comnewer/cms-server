const Router = require("koa-router");
const {returnMsg, queryFn} = require("../../util");
const router = new Router();

const  userExisted = async (username) => {
    let sql = `SELECT * FROM user WHERE username="${username}"`;
    let res = await queryFn(sql); 
    return res.length>0;
}

router.post('/',async ctx => {
    let {username, password} = ctx.request.body;

    if(!(username&&password)){
        //判断参数是否缺失
        ctx.body = returnMsg(1, '失败', '参数错误');        
    }else if(await userExisted(username)){
        //用户名是否重复
        ctx.body = returnMsg(2, '失败', '用户名已存在');        
    }else{
        //注册成功
        let sql=`INSERT INTO user VALUES(null,'${username}','${password}',null,'avatar.jpg')`;
        let res = await queryFn(sql);
        ctx.body = returnMsg(0, '注册成功');
    }
})

module.exports=router;