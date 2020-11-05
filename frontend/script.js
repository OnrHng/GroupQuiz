const selectQuiz = document.getElementById('selectQuiz');
const createQuiz = document.getElementById('createQuiz');
const joinQuiz = document.getElementById('joinQuiz');

function goQuizs() {
  window.location.href = '../components/htmls/quiz.html';
}

function goCreateQuiz() {
  window.location.href = '../components/htmls/editor.html';
}

function goJoinQuiz() {
  window.location.href = '../components/htmls/joinQuiz.html';
}

// event Listener
selectQuiz.addEventListener('click', goQuizs);
createQuiz.addEventListener('click', goCreateQuiz);
joinQuiz.addEventListener('click', goJoinQuiz);
