// DOM 
const submitQuizButton = document.getElementById('submitQuizButton');
const questionFrom = document.getElementById('formQuestion');
const addButton = document.getElementById('addButton');
const qiuzTitleForm = document.getElementById('formQuizTitle');
const questionTemplateDiv = document.getElementById('questionTemplate');
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
  var quizNameId=13;
  var url = new URL('http://localhost:3000/questiones/'+ quizNameId)
    
    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        var tbody = document.getElementById('tbody');
        tbody.innerHTML = "";
        var count=0;
        for (var item of data) {
          if(item.length>0 && count==0){
            var row=tbody.insertRow();
            var cell3 = row.insertCell(); 
            cell3.innerHTML='<form id="formQuizTitle"><div class="quiz-title-container"><label for="" id="quizTitle">Quiz Title</label><input type="text" name="quizName" id="quizName" value='+item.quiz_name+'></div> </form>'
          count++;
          }
            var row = tbody.insertRow();
            var cell3 = row.insertCell();
            cell3.innerHTML = '<fieldset style="margin-top: 10px;"><legend>Define Question</legend><label for="question">Question</label><input type="text" name="question" id="question" value='+ item.question+'><!-- Answers --><div class="answers-container"><div class="answers-title"><div class="answersTitle"><h3>Answers</h3></div><div class="correctTitle"><h3>Correct</h3></div></div><div class="answers-wraper"><div class="answer"><input type="text" name="A" id="answerA" value='+ item.option1+'><input type="radio" name="correct" id="correctA" checked></div><div class="answer"><input type="text" name="B" id="answerB" value='+ item.option2+'><input type="radio" name="correct" id="correctB"></div><div class="answer"><input type="text" name="A" id="answerC" value='+ item.option3+'><input type="radio" name="correct" id="correctC"></div><div class="answer"><input type="text" name="A" id="answerD" value='+ item.option4+'><input type="radio" name="correct" id="correctD"></div></div></div></fieldset>';            
        }
        });

}
 


// click Submit Button 
function submitQuiz(event) {
  window.location.href = "../htmls/quiz.html"
}

// post Questions
async function postQuestions(event) {
  event.preventDefault();
  getCorrectAnswer();
  
  // if the quiz name is not saved show the message!!
 //if(addButton.disabled) {
    saveQuizName(event);
    fetch("/postQuestions", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        quiz_Id: 13,
        question: question.value,
        option1:  answerA.value,
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
      displayNextQuestion();
        // increment question number and display it
        questionNumber++;
        document.getElementById('questionNumber').textContent = questionNumber + " Questions ADDED!";
  
      } else {
        console.log('error');
      }
    });
  //}
  /*else {
    alert('Please Save Quiz Name!!!');
  }*/

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
        
console.log("ok");
      } else {
        console.log('eroor');
      }
  });

}

// EvenListener
addButton.addEventListener('click', postQuestions);
//questionFrom.addEventListener('submit', postQuestions);
submitQuizButton.addEventListener('click', submitQuiz);