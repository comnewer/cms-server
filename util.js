const mysql = require("mysql");

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

module.exports={
    host, port, query
}