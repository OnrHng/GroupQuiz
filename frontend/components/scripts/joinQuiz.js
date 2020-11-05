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

socket.onmessage = function(event) {
  var jsonObj = JSON.parse(event.data);

  if(jsonObj.type === 'getAllQuestions') {
    // go playQuiz page if student login in
    if (pageDiv.textContent.startsWith('Please wait for')) {
      window.location.href = "../htmls/playQuiz.html";
    }
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

function checkCode() {
  if (inputCode.value.length > 0 && participationName.value.length > 0) {
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
  }else {
    message.textContent = "Please type quiz code and your name!";
  }
}

function postName() {
  socket.send(JSON.stringify({eventType: 'joinNewStudent', data: {
    participationName: participationName.value 
  }}));
}

// event Listeners
joinQuizButton.addEventListener('click', checkCode);