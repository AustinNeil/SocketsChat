$(function (){
  // initialize all global variables
  var $body = $('body');
  var $usernameInput = $('.usernameInput');
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');

  var $chatPage = $('.chat.page');
  var $loginPage = $('.login.page');

  var username;

  var $currentInput = $usernameInput.focus();

  // define setUsername function
  function setUsername () {
    // Username should be what is input and sanitized
    username = cleanInput($usernameInput.val().trim());
    // If a username has been set
    if(username){
      // Hide the login Page
      $loginPage.fadeOut();
      // Show the chat page
      $chatPage.show();
      // Turn clicking off for login page
      $loginPage.off('click');
      // change the input focus
      $currentInput = $inputMessage.focus();
      // emit add user to server, pass username
      socket.emit('add user', username);
    }
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Initialize socket
  var socket = io('http://localhost:3000');

  // listen for key presses
  $body.on('keypress',function (event) {
    // store the event key number
    var key = event.which;
    // if a key is being pressed, they're typing
    typing = true;
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      // refocus to the input if it isn't
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (key === 13) {
      // if a username is set (ie they are past the login page)
      if (username) {
        // emit a chat message to server, pass sanitized input
        socket.emit('chat message', cleanInput($inputMessage.val().trim()));
        // set the input message field back to blank
        $inputMessage.val('');
        // tell server that user has stopped typing
        // socket.emit('stop typing');
        // set typing to false
        typing = false;
      } else {
        // if username hasn't been set, call this (will only happen in login page once)
        setUsername();
      }
    }
  });


  // emit the new connection being established
  socket.emit('new connection');

  // when a chat message has been received from server
  socket.on('chat message',function(msg){
    // append an li to the message class with the message
    $('.messages').append($('<li>').text(msg));
  });
});
