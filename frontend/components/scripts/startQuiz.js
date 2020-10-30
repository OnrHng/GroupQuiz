const namesDiv=document.getElementById("studentsNames");

fetch("/quizStart")
.then(response => response.json())
.then(function(data) {
  document.getElementById('h2').innerText  += data.praticipationCode.praticipationCode;
  console.log(data);
  namesDiv.textContent=data.studentsNames;
});

// should be display all students name
function startNow(){
    alert('starting Quiz!');
}