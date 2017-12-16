var p1 = document.querySelector("#p1");
var p2 = document.querySelector("#p2");
var p1disp=document.querySelector("#p1disp");
var p2disp=document.querySelector("#p2disp");
var reset=document.querySelector("#reset");
var disp=document.querySelector("#playingdisp");
var numinput = document.querySelector("input");

winningscor=5;

p1score=0;
p2score=0;
gameover=false;

p1.addEventListener("click",function(){

if(!gameover){
  p1score++;
  if(p1score===winningscor){
    p1disp.classList.add("winner");
    gameover=true;

}
  p1disp.textContent=p1score;

 }
});

p2.addEventListener("click",function(){

  if(!gameover){
    p2score++;
    if(p2score===winningscor){
      p2disp.classList.add("winner");
      gameover=true;

      }
    p2disp.textContent=p2score;
}
});


function reset1(){
  p1score=0;
  p2score=0;
  p1disp.textContent=0;
  p2disp.textContent=0;
  p1disp.classList.remove("winner");
  p2disp.classList.remove("winner");
  gameover=!gameover;
}

reset.addEventListener("click",function(){
  reset1();
});


numinput.addEventListener("change",function(){
disp.textContent=numinput.value;
winningscor=Number(numinput.value);
reset1();

});
