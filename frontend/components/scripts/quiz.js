
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
            cell4.innerHTML = '<button class="button" value="Delete"  onClick="delete(this">Delete</button>'; 
            cell5.innerHTML = '<button class="button" id="'+item.quiz_Id+'" onClick="goQuizStart()">'+'<i class="fa fa-play">'+'</i>'+'</button> ';
            
        }
    });

function goQuizStart() {
    window.location.href = "../htmls/quizStart.html"
}



Object.prototype.remove = function(){
    this.parentNode.parentNode.removeChild(this.parentNode);
};
Object.prototype.removeDB = function(){
    var parent=this.parentElement;
    var firstChild=parent.firstElementChild;
    var quiz=firstChild.textContent;
    var url = new URL('http://localhost:3000/removeDB/'+ quiz)
    fetch(url,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "Delete",
            body: JSON.stringify({quiz:quiz})
        })
        .then(response => response.json())
        .then(function(data) {
            var resultP = document.getElementById('result');
            resultP.innerText = "quiz " + data.quiz + " was successfully delete from database!";
        });
}
var divs = document.querySelectorAll('div');
var del = document.querySelectorAll('.del');
for (var i = 0, len = divs.length; i < len; i++) {
    del[i].addEventListener('click',removeDB,false);
    del[i].addEventListener('click', remove, false);
}