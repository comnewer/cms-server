const koa = require("koa2");
const {host,port} = require("./util");
const Router = require("koa-router");
const web = require("./router/web");
const manage = require("./router/manage");
const nomatch = require("./router/nomatch");
const cors = require("koa2-cors")
const static =require("koa-static");
const path = require("path");

const app = new koa();
const router = new Router();
const bodyParser = require('koa-bodyparser');

router.get('/',async ctx => {
    ctx.body='home';
})

router.use('/web', web.routes(), web.allowedMethods());
router.use('/manage', manage.routes(), manage.allowedMethods());
router.use('/404', nomatch.routes(), nomatch.allowedMethods());

app.use(async (ctx, next) => {
    await next();
    if(parseInt(ctx.status) === 404){
        ctx.response.redirect('/404');
    }
})

//app.use(cors());
app.use(bodyParser());
app.use(router.routes(),router.allowedMethods());
app.use(static(path.join(__dirname,'static')));
app.use(static(path.join(__dirname,'router/manage/upload')));
app.listen(port,()=>{
    console.log(`sever is running at ${host}:${port}`);
})
