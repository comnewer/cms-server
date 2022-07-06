const Router = require("koa-router");
const {returnMsg, queryFn, jwtVerify} = require("../../util");
const multer = require('@koa/multer');
const path = require('path');
const router = new Router();

//onst app = new Koa();

// 存储文件的名称
let myfilename = '';

const storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname ,'upload/'))
    },
    //修改文件名称
    filename: function (req, file, cb) {
        let type = file.originalname.split('.')[1]
        // logo.png -> logo.xxx.png
        myfilename = `${file.fieldname}-${Date.now().toString(16)}.${type}`
        cb(null, myfilename)
    }
})

//文件上传限制
const limits = {
    fields: 10,//非文件字段的数量
    fileSize: 200 * 1024,//文件大小 单位 b
    files: 1//文件数量
}

let upload = multer({storage,limits});

router.post('/', upload.single('avatar') ,async ctx => {
    //获取token
    let token = ctx.request.headers['cms-token'];
    //鉴权
    if(!jwtVerify(token)){
        //鉴权失败
        ctx.body=returnMsg(2,'查询失败','token过期或用户不存在');
        return;
    }
    //鉴权成功
    //修改数据库中对应用户的avatar
    const sql_update = `UPDATE user SET avatar='${myfilename}' WHERE token='${token}'`;
    await queryFn(sql_update);
    //查询修改结果，并返回修改结果
    let sql_search = `SELECT username,token,avatar FROM user WHERE token='${token}'`;
    let res = await queryFn(sql_search);
    ctx.body=returnMsg(0,'修改成功',{
        username: res[0].username,
        'cms-token': res[0].token,
        avatar: res[0].avatar,
    }); 
})

module.exports=router;