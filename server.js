var express = require('express');
var app = express();
var http = require('http').Server(app);

app.use(express.static('public'));

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/public/index.html');
// });

http.listen(3001, function(){
    console.log('listening on *:3001');
});