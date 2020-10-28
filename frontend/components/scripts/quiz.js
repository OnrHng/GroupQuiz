
var url = new URL('http://localhost:3000/quiz')
    
    fetch(url)
    .then(response => response.json())
    .then(function(data) {
        var tbody = document.getElementById('tbody');
        tbody.innerHTML = "";
        for (var item of data) {

            var row = tbody.insertRow();
            var cell2 = row.insertCell();
            var cell3 = row.insertCell();
            var cell4 = row.insertCell();
            var cell5 = row.insertCell();

            cell2.innerText = item.quiz_name; 
            cell3.innerHTML = '<button class="button" value="Edit"  onClick="edit(this)">Edit</button>'; 
            cell4.innerHTML = '<button class="button" value="Delete"  onClick="delete(this)">Delete</button>'; 
           // cell5.innerHTML = '<button class="button" id="'+item.quiz_Id+'" onClick="addLikes(this)">'+'<i class="fa fa-play">'+'</i>'+'</button> ';
            cell5.innerHTML = '<button class="button" id="playQuiz"onClick="play(+'quiz_name'+)">Play</button>';

            cell4.innerHTML = '<button onclick="sendPatch('+ data.Id + ')">Like!</button>';
        }
    });

    function play(this){

    }