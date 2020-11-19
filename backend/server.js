// create here a server 
const express = require('express');
const app = express();
const mysql = require("mysql");
const dbconfig = require("./configDb.js");
// get it and put the new quiz button click func
let praticipationCode = '';
const crypto = require('crypto');
const WebSocket = require('ws');

let studentsNames = '';
var correctAnswer;
let questionPoint;
var students = {};
var selectedOptionCount = 0;
// Send Quiz Name from Play Button
var quizName;
// e.g. object for statistic
var optionsStatistics = {
  option1: 0,
  option2: 0,
  option3: 0,
  option4: 0,
};

// parse HTTP POST Data 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // accept json data

// put client-side code (html/css/js) in the frontend folder
app.use(express.static('frontend'));


var db = mysql.createPool({
  host: dbconfig.dbSettings.host,
  user: dbconfig.dbSettings.user,
  password: dbconfig.dbSettings.password,
  database: dbconfig.dbSettings.database
});


// Running Server on PORT
const PORT = process.env.PORT || 3000;
var httpServer = app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log(`HTTP server listening at ${PORT}`);
});

// Websocket server
const wss = new WebSocket.Server({ server : httpServer });

// generate participation code without module
const codeArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
                "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
                 "a", "b", "c","d", "e", "g", "h", "i", "j", "k", "l", "m", "n",
                    "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]; 

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  praticipationCode = a.slice(0,6).join("");;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// submit quiz name on DB
app.post('/submitQuizName', (req, res) => {
  db.query("INSERT INTO quiz (quiz_name) values (?)", escapeHtml(req.body.quizName),
    (err, result) => {
      if (err) throw err;
      console.log("created a new quiz name with id ", result.insertId);
      res.json({ id: result.insertId });
    }
  );
});

// Post Questions on DB
app.post('/postQuestions', (req, res) => {
  db.query("INSERT INTO questions (quiz_Id, question, option1, option2, option3, option4, correctAnswer, questionPoint) values (?, ?, ?, ?, ?, ?, ?, ?)",
    [req.body.quizId, req.body.question, req.body.option1, req.body.option2,
    req.body.option3, req.body.option4, req.body.correctAnswer, req.body.questionPoint],

    (err, result) => {
      if (err) throw err;
      //console.log("created a new question created with id ", result.insertId);
      res.json({ id: result.insertId });
    }
  );

});

// select all quizes
app.get("/quiz", (req, res) => {
  db.query('SELECT * FROM quiz', (err, rows) => {
      if(err) throw err;
      res.json(rows);
  });
});

// delete one quiz
app.delete('/deleteQuiz', (req, res) => {
  connection.query("delete from quiz where quiz_Id = ? ",[req.body.quizId],
    (err, result) => {
      if(err) throw err;
      if (result.affectedRows == 0) {
        res.sendStatus(404);
      } else {
        res.json({"delete": result.affectedRows});
      }
    }
  );
});

app.post("/quizStart", function(req, res){
  quizName = req.body.quizName;
  res.json({quizName});
  // Reset
  students = {};
  studentsNames = "";
});

// generate Code and send the code to frontend
app.get('/generateCode', function(req, res) {
  // quiz code
  shuffle(codeArray);
  console.log(praticipationCode);

  res.json({praticipationCode:praticipationCode, quizName:quizName});
});

app.get('/quizStart', function(req, res) {
  // quiz code
  //console.log(praticipationCode);

  res.json({praticipationCode:praticipationCode});
});



//websocket methods
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    //console.log('received: %s', message);
    var jsonObj = JSON.parse(message);

    if (jsonObj.eventType === 'joinNewStudent') {
      newStudent(ws, jsonObj.data.participationName);
      //console.log(students);

      studentsNames = studentsNames + " " + jsonObj.data.participationName;
      sendToAllClients(JSON.stringify({type: 'joinNewStudent', names: studentsNames}));
    }
    
    else if (jsonObj.eventType === 'playQuiz') {
        sendToAllClients(JSON.stringify({type: 'goplayQuiz'}));
    }
    else if (jsonObj.eventType === 'getAllQuestions') {
      // sql query to get all questions with answers without correct answer
      db.query("select question_Id, question, option1, option2, option3, option4, questionPoint from questions  where quiz_Id in (select quiz_Id from quiz where quiz_name = ?)",
        [quizName], (err, results) => {
          if(err) throw err;
          ws.send(JSON.stringify({eventType: jsonObj.eventType, questions: results}));
      });
    }

    // compare user answer with the correct answer
    else if (jsonObj.eventType === 'selectedOption') {
      db.query("select correctAnswer from questions  where question_Id = ?",
        [jsonObj.questionId], (err, result) => {
          if(err) throw err;

          students[jsonObj.studentId].selectedOption = jsonObj.selectedOption;
          
          //console.log(wss.clients);
    
          if (jsonObj.selectedOption === "option1") {
            optionsStatistics.option1 += 1;
          } else if (jsonObj.selectedOption === "option2") {
            optionsStatistics.option2 += 1; 
          } else if (jsonObj.selectedOption === "option3") {
            optionsStatistics.option3 += 1;
          } else if (jsonObj.selectedOption === "option4") {
            optionsStatistics.option4 += 1;
          }

          selectedOptionCount +=1;
          if (selectedOptionCount == Object.keys(students).length) {
            sendToAllClients(JSON.stringify({eventType: 'displayNextQuestion'}));
          }

      });
    } 

    else if (jsonObj.eventType === 'initiliazeCorrectAnswer') {
      //console.log('question id ' + jsonObj.questionId);
      db.query("select correctAnswer, questionPoint from questions  where question_Id = ?",
        [jsonObj.questionId], (err, result) => {
        if(err) throw err;
        
        correctAnswer = result[0].correctAnswer;
        questionPoint = result[0].questionPoint;
      });
    }

    else if (jsonObj.eventType === 'getStatistic') {
      if (students[jsonObj.studentId].selectedOption === correctAnswer) {
        students[jsonObj.studentId].points += questionPoint;
        ws.send(JSON.stringify({eventType: 'getStatistic', msg: 'correct', correctAnswer : correctAnswer, optionsStatistics: optionsStatistics}));
      }else if(students[jsonObj.studentId].selectedOption === null){
        ws.send(JSON.stringify({eventType: 'getStatistic', msg: 'noAnswer', correctAnswer : correctAnswer, optionsStatistics: optionsStatistics}));
      } 
      else {
        ws.send(JSON.stringify({eventType: 'getStatistic', msg: 'wrong', correctAnswer : correctAnswer, optionsStatistics: optionsStatistics}));
      }
    } 

    else if (jsonObj.eventType === 'cleanStatistic') {
      selectedOptionCount = 0;
      for (var option in optionsStatistics) {
        optionsStatistics[option] = 0;
      }

      for ( var student in students) {
        //console.log('clear students selected option');
        students[student].selectedOption = null;
      }
    } else if (jsonObj.eventType === 'getRanking'){
      let sortedStudents = Object.values(students).sort((a,b) => b.points-a.points);
      ws.send(JSON.stringify({eventType: 'displayRanking', students: sortedStudents}));
    }

  });
  

  ws.on('close', function close(number, reason) {
    console.log('close, number: ' + number + " reason: " + reason);
  });
});

function newStudent(ws, name) {
  id = crypto.randomBytes(8).toString('hex');
  students[id] = { name: name, selectedOption: null, points: 0 };
  //console.log("new user connected, id: " + id);
  ws.send(JSON.stringify({ eventType: 'ID', id: id }));
}

// send data all clients for Broadcast
function sendToAllClients(msg) {
  wss.clients.forEach(function(client) {
      client.send(msg);
  });
}
