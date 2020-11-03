// create here a server 
const express = require('express');
const app = express();
const mysql = require("mysql");
const dbconfig = require("./configDb.js");
const praticipationCode = require("./components/quizCode.js");
const WebSocket = require('ws');

let studentsNames = '';

// parse HTTP POST Data 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // accept json data

// put client-side code (html/css/js) in the frontend folder
app.use(express.static('../frontend'));


connection = mysql.createConnection(dbconfig.dbSettings);
connection.connect((err) => {
    if(err) {
        console.log('Error connecting to DB: change connection settings!');
    } else {
        console.log('Connection established!');
    }
});

// Running Server on PORT
const PORT = 3000;
var httpServer = app.listen(PORT, () => {
  console.log(`HTTP server listening at http://localhost:${PORT}`);
});

// Websocket server
const wss = new WebSocket.Server({ server : httpServer });


function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// save quiz name on DB
app.post('/saveQuizName', (req, res) => {
  connection.query("INSERT INTO quiz (quiz_name) values (?)", escapeHtml(req.body.quizName), 
    (err, result) => {
        if(err) throw err;
        console.log("created a new quiz name with id ", result.insertId);
        res.json({id: result.insertId});
    }
  );
});

// Post Questions on DB
app.post('/postQuestions', (req, res) => {
  connection.query("INSERT INTO questions (quiz_Id, question, option1, option2, option3, option4, correctAnswer) values (?, ?, ?, ?, ?, ?, ?)", 
  [req.body.quizId, req.body.question, req.body.option1, req.body.option2,
  req.body.option3, req.body.option4, req.body.correctAnswer], 
    (err, result) => {
        if(err) throw err;
        console.log("created a new question created with id ", result.insertId);
        res.json({id: result.insertId});
    }
  );

});

// select all quizes
app.get("/quiz", (req, res) => {
  connection.query('SELECT * FROM quiz', (err, rows) => {
      if(err) throw err;
      res.json(rows);
  });
});

// Send Quiz Name from Play Button
var quizName;
app.post("/quizStart", function(req, res){
  quizName = req.body.quizName;
  res.json({quizName});
});

// generate Code and send the code to frontend
app.get('/quizStart', function(req, res) {
  res.json({praticipationCode, quizName});
});

//websocket methods
wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var nameObj = JSON.parse(message);

    if (nameObj.eventType === 'joinNewStudent') {
      console.log('running');
      studentsNames = studentsNames + " " + nameObj.data.participationName;
      sendToAllClients(JSON.stringify({type: 'getNewName', names: studentsNames}));
    } 
  });

  ws.on('close', function close(number, reason) {
    console.log('close, number: ' + number + " reason: " + reason);
  });

});

// send the new joined Student names to teacher page via Ws
// function sendNameTeacherOverview(name){}

// we use this func in the future
// send data all clients for Broadcast
function sendToAllClients(msg) {
  wss.clients.forEach(function(client) {
      client.send(msg);
  });
}