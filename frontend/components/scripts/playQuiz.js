var questionsArray;

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
    //console.log(jsonObj.questions);
    //console.log(jsonObj);
    questionsArray = jsonObj.questions;
  }

  if (jsonObj.eventType === 'getCorrectOption') {
    
    if (jsonObj.msg === 'correct'){
      // change button background
      // show the message answer is right 
    } else if (jsonObj.msg === 'wrong'){
      // change button background
      // show the message answer is wrong

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





var intervalSec;
// Executed on Page Load
window.onload = function() {
    displayNextQuesion();
    intervalSec = setInterval(countDown, 1000);
}

// FUNCTIONS //

// display next question
var question = document.getElementById("question");
const buttonArray = document.querySelectorAll(".btn-group > button");

var index = 0;
function displayNextQuesion() {  
    if (index < questionsArray.length) {
        question.innerText = questionsArray[index].question;

        buttonArray[0].innerText = questionsArray[index].option1;
        buttonArray[1].innerText = questionsArray[index].option2;
        buttonArray[2].innerText = questionsArray[index].option3;
        buttonArray[3].innerText = questionsArray[index].option4;

        index++;
        return true;

    } else {
        return false;
    }
};

// Button Disable
const message = document.getElementById("message");
const buttonStandartColor = buttonArray[0].style.backgroundColor;

function buttonDisable(boolean, selectedButton) {
  message.innerText = "Please wait for next question!";

  buttonArray.forEach(item => {
    item.disabled = boolean

    // changing Color
    if (boolean) {
      item.style.background = "grey";
      item.style.cursor='not-allowed';
    } else {
      item.style.background = buttonStandartColor;
    }
  })
  // selected Option
  if (selectedButton != null) {
    selectedButton.style.background = buttonStandartColor;
  }
  return;
};

// Counter
const quizContainer = document.querySelector(".playquiz-container");
const finish = document.getElementById("Finish");
const timer = document.getElementById("timer");
const maxTime = 30; // Change here the time
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
buttonArray.forEach(button => {button.addEventListener('click', () => buttonDisable(true, button))});