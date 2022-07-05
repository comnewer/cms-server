const Router = require("koa-router");
const {query} = require("../../util");
const login = require("./login");
const register = require("./register");
const router = new Router();


router.get('/',async ctx => {
    let res = await new Promise((resolve,reject)=>{
        query('SELECT * FROM user',(err, rows) => {
            if(err)
                reject(err);
            resolve(rows);
        })
    }) 
    ctx.body=res;
})

router.use('/login', login.routes(), login.allowedMethods());
router.use('/register', register.routes(), register.allowedMethods());
module.exports=router;
