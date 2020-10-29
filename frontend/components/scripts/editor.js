// DOM 
const submitQuizButton = document.getElementById('submitQuizButton');
const questionFrom = document.getElementById('formQuestion');
const nextButton = document.getElementById('nextButton');
const qiuzTitleForm = document.getElementById('formQuizTitle');
const questionTemplateDiv = document.getElementById('questionTemplate');
const quizTitleButton = document.getElementById('quizTitleButton');

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

// click next Button
function displayNextQuestion() {
  // get here question template
}

// define question template to add new question
const questionTemplate = `
  <fieldset style="margin-top: 10px;">
    <legend>Define Question</legend>
    <label for="question">Question</label>
    <input type="text" name="question" id="question" placeholder="Type Question" required>
    <!-- Answers -->
    <div class="answers-container">
      <div class="answers-title">
        <div class="answersTitle"><h3>Answers</h3></div>
        <div class="correctTitle"><h3>Correct</h3></div>
      </div>
      <div class="answers-wraper">
        <div class="answer">
          <input type="text" name="A" id="answerA" placeholder="Type Answer A" required>
          <input type="radio" name="correct" id="correctA" checked>
        </div>
        <div class="answer">
          <input type="text" name="B" id="answerB" placeholder="Type Answer B" required>
          <input type="radio" name="correct" id="correctB">
        </div>
        <div class="answer">
          <input type="text" name="A" id="answerC" placeholder="Type Answer C" required>
          <input type="radio" name="correct" id="correctC">
        </div>
        <div class="answer">
          <input type="text" name="A" id="answerD" placeholder="Type Answer D" required>
          <input type="radio" name="correct" id="correctD">
        </div>
      </div>
    </div>
  </fieldset>
  <div class="nextQuestion">
  <input type="submit" value="NEXT" id="nextButton">
  </div>

    `;

// click Submit Button 
function submitQuiz(event) {
  window.location.href = "../htmls/quiz.html";
}

// post Questions
async function postQuestions(event) {
  event.preventDefault();
  getCorrectAnswer();
  
  // if the quiz name is not saved show the message!!
  if(quizTitleButton.disabled) {
    fetch("/postQuestions", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        quiz_Id: quizNameId,
        question: question.value,
        option1: answerA.value,
        option2 : answerB.value,
        option3 : answerC.value,
        option4 : answerD.value,
        correctAnswer: correctAnswer
      })
      }
    ).then(function(response) {
      if(response.ok){
        console.log('question is posted!')
        // new question template HERE
        questionTemplateDiv.innerHTML = '';
        questionTemplateDiv.innerHTML = questionTemplate;
      
        // increment question number and display it
        questionNumber++;
        document.getElementById('questionNumber').textContent = questionNumber + " Questions ADDED!";
  
      } else {
        console.log('eroor');
      }
    });
  }else {
    alert('Please Save Quiz Name!!!');
  }

}

// ASYNC FUNC SHOULD BE
// save quiz name
async function saveQuizName(event){
  event.preventDefault();
  console.log('save quiz name clicked');

  fetch("/saveQuizName", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
        quizName : quizName.value
      })})
    .then(async function(response) {
      if(response.ok){
        var quiz =await response.json();
        console.log(quiz);
        console.log('quiz is posted! and quiz number is ' + quiz.id);
        quizNameId = quiz.id;
        // save button should be disable
        document.getElementById('quizTitleButton').disabled = true;
        document.getElementById('quizTitleButton').classList.add('disabled');

      } else {
        console.log('eroor');
      }
  });

}

// EvenListener
qiuzTitleForm.addEventListener('submit', saveQuizName);
questionFrom.addEventListener('submit', postQuestions);
submitQuizButton.addEventListener('click', submitQuiz);