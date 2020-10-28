
const array = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
                "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
                 "a", "b", "c","d", "e", "g", "h", "i", "j", "k", "l", "m", "n",
                    "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]; 
var length = array.length;

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

shuffle(array);
var teilnehmenCode = array.slice(0,6);
var teilnehmenCode2 = teilnehmenCode.join("");
document.getElementById('h2').innerHTML =  teilnehmenCode2;



function startNow(){
    alert('starting Quiz!');
}


console.log(teilnehmenCode2);







