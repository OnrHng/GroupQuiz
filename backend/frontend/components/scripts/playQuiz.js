const buttonArray = Array.from(document.querySelectorAll(".btn-group button"));
const statisticsArray = document.querySelectorAll("p");
const resultMessage = document.getElementById('result');
const rankingHeader = document.getElementById('ranking-header');
const rankingTable = document.getElementById('rankingTable');
const questionPoint = document.getElementById('point');
var questionsArray;
var questionId;
var intervalSec;
intervalSec = setInterval(countDown, 1000);
studentId = window.location.search.replace("?id=", "");



// web socket on frontend , should implement here
var socket = new WebSocket("wss://play-group-quiz.herokuapp.com/");
socket.onopen = function(e) {
  // console.log("[open] Connection established");
  socket.send(JSON.stringify({eventType: 'getAllQuestions'}));
};


socket.onmessage = function(event) {
  var jsonObj = JSON.parse(event.data);


  if(jsonObj.eventType === 'getAllQuestions') {
    questionsArray = jsonObj.questions;
    displayNextQuesion(); // displaying first question 

    questionId = questionsArray[index-1].question_Id;
    initiliazeCorrectAnswer(questionId);

  }
  else if (jsonObj.eventType === 'getStatistic') {
    if (jsonObj.msg === 'correct'){
      // console.log("correct");
      resultMessage.innerText = "Answer is correct.";
      displayCorrectAnswer(jsonObj.correctAnswer);
    } else if (jsonObj.msg === 'wrong'){
      // console.log("wrong");
      resultMessage.innerText = "Answer is wrong!";
      displayWrongAnswer(selectedOption);
      displayCorrectAnswer(jsonObj.correctAnswer);
    } else if (jsonObj.msg === 'noAnswer'){
      // console.log("noAnswer");
      resultMessage.innerText = "You didn't choose any answer!!!";
      displayCorrectAnswer(jsonObj.correctAnswer);
    } 

    // display Statistic
    for(const statistic in jsonObj.optionsStatistics){
      // 
       if (statistic === 'option1') {
         document.getElementById('statistic1').innerText = jsonObj.optionsStatistics[statistic];
       } else if (statistic === 'option2') {
         document.getElementById('statistic2').innerText = jsonObj.optionsStatistics[statistic];
       } else if (statistic === 'option3') {
         document.getElementById('statistic3').innerText = jsonObj.optionsStatistics[statistic];
       } else if (statistic === 'option4') {
         document.getElementById('statistic4').innerText = jsonObj.optionsStatistics[statistic];
       }
     }
  } else if (jsonObj.eventType === 'displayRanking') {
    displayRanking(jsonObj.students);

  } else if (jsonObj.eventType === 'displayNextQuestion') {
    currentTime = 0;
  }
};

// socket.onclose = function(event) {
//   if (event.wasClean) {
//     // console.log(`[close] Connection closed cleanly, reason=${event.reason}`);
//   } else {
//     // e.g. server process killed or network down
//     // console.log('[close] Connection died, code:' + event.code);
//   }
// };

// socket.onerror = function(error) {
//   // console.log(`[error] ${error.message}`);
// };




// FUNCTIONS //

// display next question
var question = document.getElementById("question");

var index = 0;
function displayNextQuesion() {
    if (index < questionsArray.length) {
        question.innerText = questionsArray[index].question;
        questionPoint.innerText = questionsArray[index].questionPoint + " Points";
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

// Correct / False - Answer
function displayCorrectAnswer(correctAnswer) {
  Array.from(buttonArray).filter(x => x.id === correctAnswer)[0].classList.add('correct');
}

function displayWrongAnswer(selectedOption) {
  if (selectedOption === null) {
    return;
  } else {
    document.getElementById(selectedOption).classList.add('wrong');
  }
};


// Button Disable
const message = document.getElementById("message");
const buttonStandartColor = "black";
var selectedOption = null;

function buttonDisable(boolean, selectedButton) {
  message.innerText = "Please wait for next question!";

  buttonArray.forEach(button => {
    button.className = '';
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
    questionId: questionId,
    studentId: studentId,
  }));
  // console.log(`questionId: ${questionId}, selectedOption: ${selectedOption}`);
};

function getStatistic() {
  socket.send(JSON.stringify({
    eventType: 'getStatistic',
    studentId: studentId,
  }));
}

function cleanStatistic() {
  socket.send(JSON.stringify({
    eventType: 'cleanStatistic',
  }));
}

function initiliazeCorrectAnswer(questionId) {
  socket.send(JSON.stringify({
    eventType: 'initiliazeCorrectAnswer',
    questionId: questionId
  }));
}

function getRanking() {
  socket.send(JSON.stringify({
    eventType: 'getRanking'
  }));
}

function displayRanking(students) {
  rankingHeader.hidden = false;
  rankingTable.hidden = false;
  var rank = 1; // max should be 3

  var counter = 0;
  for(var i in students) {
    // Ranking
    if (students.length > 1){
      if (parseInt(i) > 0){
        var previousIndex = parseInt(i) - 1;
        var previousStudent = students[previousIndex];
        if(students[i].points != previousStudent.points){
          rank++;
        }
      }
    }
    students[i].rank = rank;
  };
  var rank1Counter = 0;
  var rank2Counter = 0;
  for (var student of students) {
    if ((student.rank == 2 && rank1Counter > 2) || (student.rank == 3 && (rank2Counter > 1 || rank1Counter > 1) || (student.rank > 3))) {
      return
    } else {
    
    // Table
    var row = rankingTable.insertRow();

    var cellRank = row.insertCell();
    cellRank.innerText = student.rank + ". ";
  
    var cellName = row.insertCell();
    cellName.className = "cellName";
    cellName.innerText = student.name;

    var cellPoints = row.insertCell();
    cellPoints.innerText = student.points + "P.";

    if (student.rank == 1) {rank1Counter += 1;}
    if (student.rank == 2) {rank2Counter += 1;}
  }
}
}


// Counter
const maxTime = 30; // How long questions should be displayd
const resultTime = 5; // How long question results should be displayd
const timer = document.getElementById("timer");
const quizContainer = document.querySelector(".playquiz-container");
const finish = document.getElementById("Finish");
var currentTime = maxTime;

function countDown() {
  // displaying the time
  if (currentTime >= -resultTime) {
    timer.innerHTML = "Time left: " + currentTime + " seconds";;
    currentTime--;
  }
  // when timer reaches -1
  if (currentTime == -1){ // Display correct / false - Answer and show answer count
    timer.hidden = true;
    getStatistic();
  }
  else if (currentTime == -resultTime) { // Display next question
    // Reset
    buttonDisable(false);
    currentTime = maxTime;
    message.innerText = "";
    timer.innerHTML = "";
    timer.hidden = false;
    cleanStatistic();
    resultMessage.innerText = '';
    questionPoint.innerText = '';

    for(const element of statisticsArray){
      element.innerText = '';
    }

    if (displayNextQuesion()){ 
      questionId = questionsArray[index-1].question_Id;
      initiliazeCorrectAnswer(questionId);
    } else { // when no question available
      getRanking();

      // Dummy Page
      for (var i of quizContainer.children) {i.hidden = true;}
      const wraperBtn = document.querySelectorAll('.wraper');
      for (var element of wraperBtn) {element.style.display = "none";}
      finish.hidden = false;
      clearInterval(intervalSec);
    }
  }
  return;
};

// EventListeners
buttonArray.forEach(button => {button.addEventListener('click', function() {
  buttonDisable(true, button);
  questionId = questionsArray[index-1].question_Id;
  sendSelectedOption(selectedOption);
})});