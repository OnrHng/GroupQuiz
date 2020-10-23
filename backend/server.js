// create here a server 
const express = require('express');
const app = express();
const mysql = require("mysql");
const dbconfig = require("./configDb.js");


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

// http://localhost:3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});