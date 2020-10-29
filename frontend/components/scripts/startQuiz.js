fetch("/quizStart")
.then(response => response.json())
.then(function(data) {
  document.getElementById('h2').innerText  += data.praticipationCode;
});

// should be display all students name

function startNow(){
    alert('starting Quiz!');
}