
// var questions = [
//         {
//             question: "Hallo wie gehts?",
//             option1: "a",
//             option2: "b",
//             option3: "c",
//             option4: "d",
//             correctAnswer: "correctAnswer"
//         },
//         {
//             question: "Was machst du heute?",
//             option1: "ga",
//             option2: "sd",
//             option3: "df",
//             option4: "dbsdb",
//             correctAnswer: "correctAnswer"
//         },
// ];

// display questions every 30 seconds
var questions = jsonObj.questions;
var time = 3 * 1000; // changing later to 30
var index = 0;
var interval;

window.onload = function() {
    displayNextQuesion();
    interval = setInterval(displayNextQuesion, time);
}

function displayNextQuesion() {  
    if (index < questions.length) {
        var question = document.getElementById("question");
        var option1 = document.getElementById("option1");
        var option2 = document.getElementById("option2");
        var option3 = document.getElementById("option3");
        var option4 = document.getElementById("option4");

        question.innerText = questions[index].question;
        option1.innerText = questions[index].option1;
        option2.innerText = questions[index].option2;
        option3.innerText = questions[index].option3;
        option4.innerText = questions[index].option4;

    } else {
        console.log("stop")
        clearInterval(interval);
        return
    }
    index++;
    return
};