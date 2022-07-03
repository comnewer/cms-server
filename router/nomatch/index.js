const Router = require("koa-router")
const router = new Router();
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");

router.get('/',async ctx => {
    let filepath = path.join(__dirname, "../../static/images/404.png");
    let file = fs.readFileSync(filepath);
    let mimeType = mime.lookup(file);
    ctx.set('content-type', mimeType);
    ctx.body =file;
})


module.exports=router;