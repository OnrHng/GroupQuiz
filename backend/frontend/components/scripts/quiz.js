
fetch("/quiz")
.then(response => response.json())
.then(function(data) {
    var tbody = document.getElementById('tbody');
    tbody.innerHTML = "";
    for (var item of data) {

        var row = tbody.insertRow();
        var cell2 = row.insertCell();
        var cell3 = row.insertCell();
        var cell4 = row.insertCell();
        var cell5 = row.insertCell();

        cell2.innerText = item.quiz_name; 
        cell3.innerHTML = '<button class="button" value="Edit"  onClick="edit(this)">Edit</button>'; 
        cell4.innerHTML = '<button class="button" id="'+ item.quiz_Id+'"value="Delete"  onClick="deleteQuiz(this)">Delete</button>';
        cell5.innerHTML = '<button class="button" id="'+item.quiz_name+'" onClick="goQuizStart(this)">'+'<i class="fa fa-play">'+'</i>'+'</button> ';
        
    }
});

function goQuizStart(button) {
  var quizName = button.id;
  fetch("/quizStart", {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
        quizName: quizName,
    })})
    .then(function () {
        window.location.href = "../htmls/quizStart.html"
  });
}

// Delete Quiz
function deleteQuiz(button) {
  var quizId = button.id;
  console.log(quizId);
  fetch('/deleteQuiz', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "DELETE",
    body: JSON.stringify({
      quizId: quizId,
    })})
    .then(response => response.json())
    .then(function(data) {
      var resultP = document.getElementById('result');
  });
}