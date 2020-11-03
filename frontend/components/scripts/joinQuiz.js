const joinQuizButton = document.getElementById('join');
const inputCode = document.getElementById('givenCode');
const participationName = document.getElementById('studentName');
const pageDiv = document.getElementById('pageDiv');
const message = document.getElementById("message");

// web socket on frontend , should implement here
var socket = new WebSocket("ws://localhost:3000/");
socket.onopen = function(e) {
  console.log("[open] Connection established");
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

function checkCode() {
  fetch("/quizStart")
  .then(response => response.json())
  .then(function(data) {
    if (inputCode.value === data.praticipationCode.praticipationCode) {
      postName();
      // update this page just as a loading page
      pageDiv.innerHTML = '';
      pageDiv.textContent = 'Please wait for other participants to join!';
      pageDiv.style.fontSize = '24px';
    }else {
     message.textContent="The participation code is wrong";
    }
  });
}

function postName() {
  socket.send(JSON.stringify({eventType: 'joinNewStudent', data: {
    participationName: participationName.value 
  }}));
}

// event Listeners
joinQuizButton.addEventListener('click', checkCode);