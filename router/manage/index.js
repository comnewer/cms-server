const Router = require("koa-router");
const {query} = require("../../util");
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
router.get('/list',ctx => {
    ctx.body='managelist';
})

module.exports=router;
