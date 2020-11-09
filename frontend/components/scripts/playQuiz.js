var questionsArray;
var questionId;

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
    questionsArray = jsonObj.questions;
    console.log(questionsArray);
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
    // needed because the function already get executed on the site load
    if (index > 0) {
      questionId = questionsArray[index-1].question_Id; 
    }
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
var selectedOption = null;

function buttonDisable(boolean, selectedButton) {
  message.innerText = "Please wait for next question!";

  buttonArray.forEach(button => {
    button.disabled = boolean;
  
    // changing Color
    if (boolean) { // disable
      button.classList.add("disabledButton");
      button.classList.remove("hover");
    } else { // enable
      button.classList.add("hover");
      button.classList.remove("disabledButton");
    }
  })
  // selected Option
  if (selectedButton != null) {
    selectedButton.classList.remove("disabledButton");
    selectedOption = selectedButton.id;
  } else {
    selectedOption = null;
  }
  return
};

// Send selected Option to backend
function sendSelectedOption(selectedOption) {
  socket.send(JSON.stringify({
    eventType: 'selectedOption', 
    selectedOption: selectedOption, 
    questionId: questionId
  }));
  console.log(`questionId: ${questionId}, selectedOption: ${selectedOption}`);
};

// Counter
const quizContainer = document.querySelector(".playquiz-container");
const finish = document.getElementById("Finish");
const timer = document.getElementById("timer");
const maxTime = 10; // Change here the time
var currentTime = maxTime;

// The Heart
function countDown() {
  // displaying the time
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
        currentTime--;
      }
  }
  // when timer reaches 0 do all the important stuff
  else if (currentTime < 0){
      if (displayNextQuesion()){ 
        sendSelectedOption(selectedOption);
        buttonDisable(false);
        // Reset
        currentTime = maxTime;
        message.innerText = "";
      } else { // when no question available
        sendSelectedOption(selectedOption);
        // Dummy Page
        for (var i of quizContainer.children) {i.hidden = true;}
        finish.hidden = false;
        clearInterval(intervalSec);
      }
  }
  return;
};

// EventListeners
buttonArray.forEach(button => {button.addEventListener('click', function() {
  buttonDisable(true, button);
})});