var mysql = require('mysql');
var connection = mysql.createConnection({
        host:'localhost',
        user:'nodeuser', //Your Database User Name
        password:'Pottamplackal@1995', // Your Database Password
        database:'nodeapp'
});
connection.connect(function(error){
        if(!!error) {
                console.log(error);
        } else {
                console.log('Database Connected Successfully..!!');
        }
});

module.exports = connection;
