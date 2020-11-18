// Duplicat Question-Container Template for Add Button 
const questionContainer = document.querySelector(".question-container").cloneNode(true);

// click Add Button
var radioBtnCount = 1;
function displayNextQuestion() {
  var formQuestion = document.getElementById("formQuestion");
  var validationFalse = !formQuestion.reportValidity();

  if (validationFalse) {
    return
  } else {
    newQuestionDiv = questionContainer.cloneNode(true);
    newQUestionDivRadioButtons = newQuestionDiv.querySelectorAll(".answer input[type=radio]");

    newQUestionDivRadioButtons.forEach(button => {button.name = "correct" + radioBtnCount});

    document.getElementById("formQuestion").append(newQuestionDiv);
    radioBtnCount++;
  }
};

// click Submit Button 
var quizId;
function submitQuiz() {
  var formQuizTitle = document.getElementById("formQuizTitle");
  var formQuestion = document.getElementById("formQuestion");
  var validationFalse = !(formQuizTitle.reportValidity() && formQuestion.reportValidity())

  // check validity
  if (validationFalse) {
    return
  } else {
    var questionContainerArray = document.getElementsByClassName("question-container");
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
    })
    .then(function() {
    

    // parse each question
    var questionCount = 0;
    for (var questionContainer of questionContainerArray) {
      var questionPointEl = questionContainer.querySelector('.point');
      var textFields = questionContainer.querySelectorAll(".answer input[type=text]");
      var radioButtons = questionContainer.querySelectorAll(".answer input[type=radio]");
       
      // Wich button is checked
      var radiobtn1 = radioButtons[0];
      var radiobtn2 = radioButtons[1];
      var radiobtn3 = radioButtons[2];

      var correctAnswer;
      if (radiobtn1.checked) {
        correctAnswer = "option1";
      }
      else if (radiobtn2.checked) {
        correctAnswer = "option2";
      }
      else if (radiobtn3.checked) {
        correctAnswer = "option3";
      } else {
        correctAnswer = "option4";
      }

      // fetch each question
      var question = questionContainer.querySelector("input[name=question]").value;
      var option1 = textFields[0].value;
      var option2 = textFields[1].value;
      var option3 = textFields[2].value;
      var option4 = textFields[3].value;
      var questionPoint = questionPointEl.value;

      fetch("/postQuestions", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          quizId: quizId,
          question: question,
          option1: option1,
          option2: option2,
          option3: option3,
          option4: option4,
          correctAnswer: correctAnswer,
          questionPoint: questionPoint 
        })
        }
      )
      questionCount++
    };
    alert(`Created Quiz "${quizName}" with ${questionCount} Question(s)!`)
    window.location.href = "../htmls/quiz.html";
    })};
};