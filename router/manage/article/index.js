const Router = require("koa-router");
const {returnMsg, queryFn, jwtVerify} = require("../../../util");
const list = require('./list');
const info = require('./id');
const edit = require('./edit');
const del = require('./delete');
const add = require('./add');
const moment = require("moment");
const router = new Router();

//添加测试用样例
router.get('/addsamples', async ctx => {
    for(let i=1;i<=100;++i){
        const sql_addsample=`INSERT INTO article VALUES(null,'title_test${i}','title_subtest${i}','author_test${i}','${moment().format("YYYY-MM-DD hh:mm:ss")}','<p>content${i}<p>')`;
        await queryFn(sql_addsample);
    }
    ctx.body='测试样例添加完成';
})
//提供给前端的接口
router.use('/list', list.routes(), list.allowedMethods());
router.use('/info', info.routes(), info.allowedMethods());
router.use('/edit', edit.routes(), edit.allowedMethods());
router.use('/delete', del.routes(), del.allowedMethods());
router.use('/add', add.routes(), add.allowedMethods());
module.exports=router;