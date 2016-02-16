angular
  .module('messages.controller', [])
  .directive('myRepeatDirective', function() {
  return function(scope) {
    if (scope.$last){
      document.getElementById('chatBox').scrollTop = document.getElementById('chatBox').scrollHeight + 10;
    }
  };
})
  .controller('MessagesController', function ($rootScope, $window, MainService, MessagesService, ProfileServices) {
    this.toId = MainService.getRecipientId();
    this.toName = MainService.getRecipientName();
    this.lobby = [];
    this.currentLobby;
    this.receiveMessageText = [];
    this.socket = io();
    this.userInfo = {};
    this.rootScope = $rootScope;

    this.socket.on('message', function(data){
      console.log('Msg data from socket room emit: ' + data);
      this.rootScope.$apply(function () {
        this.receiveMessageText.push({
          user: data.user + ':',
          msg: data.msg
        });
        this.oldReceiveMessageText = this.receiveMessageText
      }.bind(this))
    }.bind(this))

    this.socket.on('welcome', function(user){
      this.rootScope.$apply(function () {
        this.receiveMessageText.push({
          user: user,
          msg: ' has joined the chat'
        });
      }.bind(this))
    }.bind(this))

    this.loadMessage = function(msg) {
      this.receiveMessageText.push(msg);
    }

    this.joinLobby = function (lobby) {
      if(lobby !== this.currentLobby){
        var lobbyInfo = {
          lobby: lobby,
          userName: this.userInfo.username
        }
        this.socket.emit('joinRoom', lobbyInfo);
        this.currentLobby = lobby;
      }
    }

    this.sendMessage = function () {
      if(this.currentLobby){
        this.socket.emit('sendMsg', {user: this.userInfo.username, room: this.currentLobby, msg: this.messageText});
      }
      this.messageText = "";
    };

    this.getRooms = function () {
      MessagesService.getRooms()
      .then(function(data){
        for(var i = 0; i < data.results.length; i++){
          var lobbyInfo = data.results[i].lobby;
          var recepientEmail = lobbyInfo.replace(this.userInfo.email, '');
          MessagesService.getUsernameByEmail(recepientEmail).then(function(recepient){
            this.lobby.push({
              lobbyid: lobbyInfo,
              lobbyname: recepient
            });
          }.bind(this));
        }
      }.bind(this));
    };

    this.getUser = function () {
      ProfileServices.getProfileData()
        .then(function (resp) {
          this.username = resp.username;
        }.bind(this));
    };

    this.reply = function (userid, username) {
      this.toId = userid;
      this.toName = username;
      $window.document.getElementById('messageText').focus();
    };

    this.makeRoom = function () {
      MessagesService.makeRoom(this.toName, this.userInfo.username);
    };

    this.loadProfile = function() {
      ProfileServices.getProfileData()
        .then(function(resp) {
          this.userInfo.username = resp.username;
          this.userInfo.email = resp.email;
          this.userInfo.city = resp.city || 'santa monica';
          this.userInfo.gamesOffered = resp.offerings;
          this.userInfo.gamesSeeking = resp.seeking;
          this.getRooms();
          if(this.toName){
            this.makeRoom();
          }
        }.bind(this));
    };

    this.loadProfile();

});
