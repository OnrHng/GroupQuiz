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



// http://localhost:3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});