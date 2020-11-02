// DOM 
const submitQuizButton = document.getElementById('submitQuizButton');
const questionFrom = document.getElementById('formQuestion');
const nextButton = document.getElementById('nextButton');
const qiuzTitleForm = document.getElementById('formQuizTitle');
const questionTemplateDiv = document.getElementById('questionTemplate');
const quizTitleButton = document.getElementById('quizTitleButton');
const questionContainer = document.getElementById("quetion-cosntainer");

// data for create new Quiz
const quizName = document.getElementById('quizName');
const question = document.getElementById('question');
const answerA = document.getElementById('answerA');
const answerB = document.getElementById('answerB'); 
const answerC = document.getElementById('answerC'); 
const answerD = document.getElementById('answerD'); 
const radioButtons = document.getElementsByName('correct');

// quiz name id
var quizNameId;

// question Number
let questionNumber = 0;

// get correct Answer
let correctAnswer = ''; 
function getCorrectAnswer() {
  for(i = 0; i < radioButtons.length; i++) { 
    if(radioButtons[i].checked && radioButtons[i].id === "correctA") {
      correctAnswer = answerA.value;
    } else if (radioButtons[i].checked && radioButtons[i].id === "correctB") {
      correctAnswer = answerB.value;
    } else if (radioButtons[i].checked && radioButtons[i].id === "correctC") {
      correctAnswer =  answerC.value;
    } else if (radioButtons[i].checked && radioButtons[i].id === "correctD"){
      correctAnswer = answerD.value;
    }
    
  } 
}

var radioBtnCount = 1;
// click next Button
function displayNextQuestion() {
  newQuestionDiv = document.createElement("div");
  newQuestionDiv.innerHTML = questionTemplate
  newQuestionDiv.className = "questionContainer";

  // input fields
  newQuestionDiv.getElementsByTagName("input")[2].name = "correct" + radioBtnCount;
  newQuestionDiv.getElementsByTagName("input")[4].name = "correct" + radioBtnCount; 
  newQuestionDiv.getElementsByTagName("input")[6].name = "correct" + radioBtnCount; 
  newQuestionDiv.getElementsByTagName("input")[8].name = "correct" + radioBtnCount; 
  radioBtnCount++;

  // questionContainer.append(newQuestionDiv);
  document.getElementById("formQuestion").append(newQuestionDiv);
};

// define question template to add new question
const questionTemplate = `
  <fieldset style="margin-top: 10px;">
    <legend>Define Question</legend>
    <label for="question">Question</label>
    <input type="text" name="question" placeholder="Type Question" required>
    <!-- Answers -->
    <div class="answers-container">
      <div class="answers-title">
        <div class="answersTitle"><h3>Answers</h3></div>
        <div class="correctTitle"><h3>Correct</h3></div>
      </div>
      <div class="answers-wraper">
        <div class="answer">
          <input type="text" name="A" placeholder="Type Answer A" required>
          <input type="radio" name="correct" checked>
        </div>
        <div class="answer">
          <input type="text" name="B" placeholder="Type Answer B" required>
          <input type="radio" name="correct">
        </div>
        <div class="answer">
          <input type="text" name="A" placeholder="Type Answer C" required>
          <input type="radio" name="correct">
        </div>
        <div class="answer">
          <input type="text" name="A" placeholder="Type Answer D" required>
          <input type="radio" name="correct">
        </div>
      </div>
    </div>
  </fieldset>
    `;

// click Submit Button 
var quizId = 0;
function submitQuiz() {
  var questionContainerArray = document.getElementsByClassName("questionContainer");
  var quizName = document.getElementById("quizName").value;

  // get questionId
  fetch("/submitQuizName", {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "POST",
  body: JSON.stringify({
    quizName: quizName,
  })})
  .then(response => response.json())
  .then(function(response) {
    quizId = response.id;
    console.log(quizId);
  })
  .then(function() {
  

  // parse each question
  for (var i of questionContainerArray) {
    var inputArray = i.getElementsByTagName("input");
    
    var question = inputArray[0].value;
    var a = inputArray[1].value;
    var b = inputArray[3].value;
    var c = inputArray[5].value;
    var d = inputArray[7].value;

    var radiobtnA = inputArray[2];
    var radiobtnB = inputArray[4];
    var radiobtnC = inputArray[6];

    var correctAnswer;
    if (radiobtnA.checked) {
      correctAnswer = "a";
    }
    else if (radiobtnB.checked) {
      correctAnswer = "b";
    }
    else if (radiobtnC.checked) {
      correctAnswer = "c";
    } else {
      correctAnswer = "d"
    }

    // fetch each question
    fetch("/postQuestions", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        quizId: quizId,
        question: question,
        option1: a,
        option2: b,
        option3: c,
        option4: d,
        correctAnswer: correctAnswer, 
      })
      }
    ).then(function(response) {
      console("test")
    });


  };

  window.location.href = "../htmls/quiz.html";
  
})};

// EvenListener
document.getElementById("submitQuizButton").addEventListener('click', function () {document.getElementById("formQuizTitle").submit()});
// questionFrom.addEventListener('submit', postQuestions);
// submitQuizButton.addEventListener('click', submitQuiz);
