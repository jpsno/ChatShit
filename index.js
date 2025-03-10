var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){ 
  res.sendFile('C:\\Users\\qad245\\Desktop\\MY_FILES\\Socket IO\\index.html');
});

users = [];
io.on('connection', function(socket){
  console.log('A user connected');
  socket.on('setUsername', function(data){
      console.log(data);
      if(users.indexOf(data) > -1){
        socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
        users.push(data);
        socket.emit('userSet', {username: data});
      }
      socket.on('disconnect', (data) => {
        if (users.length > 0) {
            const disconnectedUser = users;
            console.log(`${disconnectedUser} was disconnected`);
        }
    });
  });
  
  socket.on('msg', function(data){
      //Send message to everyone
      io.sockets.emit('newmsg', data);
  })
});
http.listen(3024, function(){
  console.log('listening on localhost:3024');
});