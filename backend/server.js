// create here a server 
const express = require('express');
const app = express();
const mysql = require("mysql");
const dbconfig = require("./configDb.js");
const praticipationCode = require("./components/quizCode.js");
let studentsNames = '';
// const WebSocket = require('ws');

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
  [req.body.quiz_Id, req.body.question, req.body.option1, req.body.option2,
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
      console.log('Data received from Db:');
      console.log(rows);
      res.json(rows);
  });
});

// generate Code and send the code to frontend
app.get('/quizStart', function(req, res) {
  res.json(
    {praticipationCode, studentsNames
  });
});

// get student name frontend and send it to quiz start html´
app.post("/getParticipantName", function(req, res){
  studentsNames = studentsNames + " " + req.body.participationName;
  res.sendStatus(200);
});


// http://localhost:3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});


/*

const wss = new WebSocket.Server({ server : httpServer });
wss.on('connection', function connection(ws) {
  newUser(ws);

  // send back chat history when new user come
  if (chatHistory.length > 0) {
    ws.send(JSON.stringify({type: 'chatHistory', data: chatHistory}));
  }

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    var jsonObj = JSON.parse(message);
    if (jsonObj.eventType == 'sendGroupChat') {
      jsonObj.data.name = users[jsonObj.data.userId].name;

      //increases the number of messages sent by the user when sending a message
      users[jsonObj.data.userId].amountMsg++ ;

      // add chat text into chatHistory, if the msg start not '/'
      if (!jsonObj.data.msg.startsWith("/")){
        var text = {
          time: new Date().toLocaleTimeString(),
          msg: jsonObj.data.msg,
          userId: jsonObj.data.userId,
          name: jsonObj.data.name
        };
        chatHistory.push(text);
      }

      //reflection exercise 1 - Smilies
      if (jsonObj.data.msg.startsWith(":") || jsonObj.data.msg.startsWith(";")) {
        if (jsonObj.data.msg === ":)") {
          jsonObj.data.msg = "&#128578"; // smiley face
        } else if (jsonObj.data.msg === ":(") {
          jsonObj.data.msg = "&#128577";// upset
        } else if (jsonObj.data.msg === ":D") {
          jsonObj.data.msg = "&#128515"; //SMILING FACE WITH OPEN MOUTH
        } else if (jsonObj.data.msg === ";)") {
          jsonObj.data.msg = "&#128521"; //WINKING FACE
        } else if (jsonObj.data.msg === ";p") {
          jsonObj.data.msg = "&#128540"; //FACE WITH STUCK-OUT TONGUE AND WINKING EYE
        }
      }

      sendToAllClients(JSON.stringify(jsonObj)); // broadcast

    } else if (jsonObj.eventType == 'draw') {
      sendToAllClients(message); // broadcast
    }
    else if (jsonObj.eventType == 'setName') {
      console.log("set name of user id + " + jsonObj.data.userId +
      " from " + users[jsonObj.data.userId].name + " to " + jsonObj.data.name);
      users[jsonObj.data.userId].name = jsonObj.data.name;

    }else if (jsonObj.eventType == 'textDraw') {
      sendToAllClients(message); // broadcast
    }else if (jsonObj.eventType == 'smiley'){
      sendToAllClients(message);
    }
    // todo other messages

  });
  ws.on('close', function close(number, reason) {
    console.log('close, number: ' + number + " reason: " + reason);
  });
});

function sendToAllClients(msg) {
  wss.clients.forEach(function(client) {
      client.send(msg);
  });
}
*/