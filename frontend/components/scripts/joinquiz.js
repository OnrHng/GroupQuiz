function submitCodeAndName(){
    var joinCode = document.getElementById('givenCode').value;
    console.log(joinCode);
    console.log(teilnehmenCode2);
    
if(joinCode == teilnehmenCode2){
    window.location.href = "../htmls/quiz_start.html"
    
}else{
    document.getElementById('message').innerHTML = 'Please type correct Participation Code';
}

}
