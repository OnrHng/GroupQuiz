const joinQuizButton = document.getElementById('join');
const inputCode = document.getElementById('givenCode');
const participationName = document.getElementById('name');
const pageDiv = document.getElementById('pageDiv');

function checkCode() {
  fetch("/quizStart")
  .then(response => response.json())
  .then(function(data) {
    console.log(inputCode.value);
    console.log(data.praticipationCode);

    if (inputCode.value === data.praticipationCode) {
      // update this page just as a loading page
      pageDiv.innerHTML = '';
      pageDiv.textContent = 'Please Wait!'
    }else {
      alert('Code is wrong!');
    }
  });

  // should be send participation Name to server


}

joinQuizButton.addEventListener('click', checkCode);