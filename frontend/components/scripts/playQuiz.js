const pageDiv = document.getElementById('pageDiv');
const message = document.getElementById("message");

// web socket on frontend , should implement here
var socket = new WebSocket("ws://localhost:3000/");
socket.onopen = function(e) {
  console.log("[open] Connection established");
};

socket.onmessage = function(event) {
  //console.log(`[message] Data received from server: ${event.data}`);
  var jsonObj = JSON.parse(event.data);

  if(jsonObj.type === 'getAllQuestions') {
    console.log(jsonObj.questions);
  }
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    console.log('[close] Connection died, code:' + event.code);
  }
};

socket.onerror = function(error) {
  console.log(`[error] ${error.message}`);
};


