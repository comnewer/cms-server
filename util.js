const mysql = require("mysql");
const jwt = require("jsonwebtoken");
let host="http://localhost";
let port=3001;

const pool = mysql.createPool({
    host:"localhost",
    port:"3306",
    database:"cms",
    user:"root",
    password:"key"
});

const query = (sql, callback) => {
    pool.getConnection(function(err,connection){
        connection.query(sql,function(err,rows){
            callback(err,rows);
            connection.release();
        })
    })
}

/*
    返回消息的结构
    errcode: 0 成功 ,1 参数错误, 2 其他错误
    message: 请求结果信息
    data: 返回给前端的数据
*/
const returnMsg = (errcode, message, data) => ({
    errcode: errcode || 0,
    message: message || '',
    data: data || {},
});

/*
    数据库操作的Promise封装
*/
const queryFn = (sql) => {
    return new Promise((resolve,reject)=>{
        query(sql,(err, rows) => {
            if(err)
                reject(err);
            resolve(rows);
        })
    }) 
}

const jwtVerify = (token) => {
    try{
        jwt.verify(token,'zhaowenxian');
    }catch(err){
        return false;
    }
    return true;
}

module.exports={
    host, port, query ,returnMsg, queryFn, jwtVerify
}