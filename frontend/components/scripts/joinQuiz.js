const joinQuizButton = document.getElementById('join');
const inputCode = document.getElementById('givenCode');
const participationName = document.getElementById('studentName');
const pageDiv = document.getElementById('pageDiv');
const message = document.getElementById("message");

function checkCode() {
  fetch("/quizStart")
  .then(response => response.json())
  .then(function(data) {
    console.log(participationName.value);
    if (inputCode.value === data.praticipationCode.praticipationCode) {
      // update this page just as a loading page
      pageDiv.innerHTML = '';
      pageDiv.textContent = 'Please Wait!'
    }else {
     message.textContent="The participation code is wrong";
    }
  });
  
  // should be send participation Name to server after 3 second
  var timeleft = 3;
  var downloadTimer = setInterval(function(){
  if(timeleft < 0){
    clearInterval(downloadTimer);
  } else {
    message.textContent = timeleft + " seconds remaining";
  }
  timeleft -= 1;
  }, 1000);

  setInterval(function() { postName();}, 4000);
}

function postName() {
  fetch("/getParticipantName", 
  {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({participationName: participationName.value })
  })
  .then(response => {
    if(response.ok ){
      console.log('page redirect start quiz page');
      window.location.href="../htmls/quizStart.html";
    }
    response.json()
  });
}

// event Listeners
joinQuizButton.addEventListener('click', checkCode);