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





var intervalSec;
// Executed on Page Load
window.onload = function() {
    displayNextQuesion();
    intervalSec = setInterval(countDown, 1000);
}

// FUNCTIONS //

// display next question
var index = 0;
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

        index++;
        return true;

    } else {
        console.log("stop")
        return false;
    }
};

// Button Disable
const message = document.getElementById("message");
const button1 = document.getElementById("option1");
const button2 = document.getElementById("option2");
const button3 = document.getElementById("option3");
const button4 = document.getElementById("option4");
const buttonArray = [button1, button2, button3, button4]
const buttonStandartColor = button1.style.backgroundColor;

function buttonDisable(boolean) {
  message.innerText = "please wait";

  buttonArray.forEach(item => {
    item.disabled = boolean

    // changing Color
    if (boolean) {
      item.style.background = "grey";
    } else {
      item.style.background = buttonStandartColor;
    }
  })
};

// Counter
const quizContainer = document.querySelector(".playquiz-container");
const finish = document.getElementById("Finish");
const timer = document.getElementById("timer");
const maxTime = 3; // Change here the time
var currentTime = maxTime;

function countDown() {
  if (currentTime >= 0) {
      if (currentTime == maxTime) {
          msg = "Time left: " + maxTime + " seconds";
          timer.innerHTML = msg;
          currentTime--;
      }
      else if (currentTime < maxTime) {
        seconds = Math.floor(currentTime % maxTime);
        msg = "Time left: " + seconds + " seconds";
        timer.innerHTML = msg;
        currentTime--;}
  }
  else if (currentTime < 0){
      if (displayNextQuesion()){
        buttonDisable(false);
        currentTime = maxTime;
        message.innerText = "";
      } else {
        for (var i of quizContainer.children) {
          i.hidden = true;
    
        }
        finish.hidden = false;
        clearInterval(intervalSec);
      }
  }
  return;
};

// EventListeners
buttonArray.forEach(item => {item.addEventListener('click', () => buttonDisable(true))});



