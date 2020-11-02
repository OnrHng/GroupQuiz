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

// web socket on frontend , should implement here
/*
    var socket = new WebSocket("ws://localhost:3000/");
    socket.onopen = function(e) {
      console.log("[open] Connection established");
    };

    socket.onmessage = function(event) {
      console.log(`[message] Data received from server: ${event.data}`);
      var jsonObj = JSON.parse(event.data);

      if (jsonObj.eventType == 'hello') {
        console.log("the server said hello and gave me id: " + jsonObj.data.id);
        userId = jsonObj.data.id;
      } else if (jsonObj.eventType == 'draw') {
        var x = jsonObj.data.x;
        var y = jsonObj.data.y;
        var radius = jsonObj.data.radius;
        var circlefillColor = jsonObj.data.circleFillColor;
        fillCircle(x, y, radius, circlefillColor);
      }
      else if (jsonObj.eventType == 'sendGroupChat') {
        var date = new Date();
        var dateString = date.toLocaleTimeString();

        // clear and reset event
        if (jsonObj.data.msg === "/clear") {
          chatWindow.innerHTML = "";
          
        }else if (jsonObj.data.msg === "/reset") {
          clearTo(canvas.fillColor);
        }else{
          chatWindow.scrollTop = chatWindow.scrollHeight;
          
          chatWindow.innerHTML += "<p><b>" + dateString + " | " +
            "<i> " + jsonObj.data.name + ": </i></b>" +
            jsonObj.data.msg + "</p>";
        } 

      }else if (jsonObj.type === 'chatHistory') { // entire message history
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        // insert every single message to the chat window
        for (var i=0; i < jsonObj.data.length; i++) {
          chatWindow.innerHTML += "<p><b>" + jsonObj.data[i].time + " | " +
            "<i> " + jsonObj.data[i].name + ": </i></b>" +
            jsonObj.data[i].msg + "</p>";
        }
      } else if (jsonObj.eventType === 'textDraw') {

        var x = jsonObj.data.x;
        var y = jsonObj.data.y;
        var textColor = jsonObj.data.color;
        var text = jsonObj.data.text;

        drawText(x, y, textColor, text);
      } else if (jsonObj.eventType === "smiley") {

        drawSmiley();
      }
      // todo add other events here...
    };

    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, reason=${event.reason}`);
      } else {
        // e.g. server process killed or network down
        console.log('[close] Connection died, code:' + event.code);
      }
    };

    socket.onerror = function(error) {
      console.log(`[error] ${error.message}`);
    };

    // function addMessageInChatWindow() {
        //do here 
    // }


    socket.send(JSON.stringify({eventType: 'sendGroupChat', data: {
              userId: userId,
              msg: chatInput.value 
          }}));

*/