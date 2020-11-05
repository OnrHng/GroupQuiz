const pageDiv = document.getElementById('pageDiv');
const message = document.getElementById("message");
var questions;

// web socket on frontend , should implement here
var socket = new WebSocket("ws://localhost:3000/");
socket.onopen = function(e) {
  console.log("[open] Connection established");
  socket.send(JSON.stringify({eventType: 'playQuiz'}));

};

socket.onmessage = function(event) {
//   console.log(`[message] Data received from server: ${event.data}`);
  var jsonObj = JSON.parse(event.data);

  if(jsonObj.type === 'getAllQuestions') {
    console.log(jsonObj.questions);
    questions = jsonObj.questions;
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




// display questions every 30 seconds

var time = 3 * 1000; // changing later to 30
var index = 0;
var interval;

window.onload = function() {
    displayNextQuesion();
    interval = setInterval(displayNextQuesion, time);
}

function displayNextQuesion() {  
    if (index < questions.length) {
        var question = document.getElementById("question");
        var option1 = document.getElementById("option1");
        var option2 = document.getElementById("option2");
        var option3 = document.getElementById("option3");
        var option4 = document.getElementById("option4");

        question.innerText = questions[index].question;
        option1.innerText = questions[index].option1;
        option2.innerText = questions[index].option2;
        option3.innerText = questions[index].option3;
        option4.innerText = questions[index].option4;

    } else {
        console.log("stop")
        clearInterval(interval);
        return
    }
    index++;
    return
};



