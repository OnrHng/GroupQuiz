// DOM 
const submitQuizButton = document.getElementById('submitQuizButton');
const questionFrom = document.getElementById('formQuestion');
const nextButton = document.getElementById('nextButton');
const qiuzTitleForm = document.getElementById('formQuizTitle');

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


    `;

// click Submit Button 
function submitQuiz(event) {
  window.location.href = "/quiz.html"
}

// post Questions
async function postQuestions(event) {
  event.preventDefault();
  getCorrectAnswer();
  console.log('next clicked')
  console.log('correct answer is ' + correctAnswer);
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

    } else {
      console.log('eroor');
    }
  });

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
      } else {
        console.log('eroor');
      }
  });

}

// EvenListener
qiuzTitleForm.addEventListener('submit', saveQuizName);
questionFrom.addEventListener('submit', postQuestions);
submitQuizButton.addEventListener('click', submitQuiz);