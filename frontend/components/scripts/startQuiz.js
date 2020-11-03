const namesDiv=document.getElementById("studentsNames");
const quizNameDiv = document.getElementById('quizName');

// Play Button - Show Quiz Name
window.onload = function() {
  fetch("/quizStart")
    .then(response => response.json())
    .then(function(data) {
      document.getElementById('h2').innerText  += data.praticipationCode.praticipationCode;
      quizNameDiv.innerText = quizNameDiv.innerText + " " + data.quizName;
  });
};

// should be display all students name
// web socket on frontend , should implement here
var socket = new WebSocket("ws://localhost:3000/");
socket.onopen = function(e) {
  console.log("[open] Connection established");
};

socket.onmessage = function(event) {
  //console.log(`[message] Data received from server: ${event.data}`);
  var jsonObj = JSON.parse(event.data);

  if(jsonObj.type === 'getNewName') {
    // document.getElementById('h2').innerText  += jsonObj.praticipationCode;
    namesDiv.textContent = jsonObj.names;
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