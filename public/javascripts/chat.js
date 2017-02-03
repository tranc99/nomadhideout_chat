var Chat = function(socket) {
  this.socket = socket;
}

// send a message
Chat.prototype.sendMessage = function (room, text) {
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function(room) {
  this.socket.emit('join', {
    newRoom: room
  });
};
