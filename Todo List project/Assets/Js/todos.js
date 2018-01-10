$('ul').on("click",'li',function(){
      $(this).toggleClass("completed");
});

$('ul').on("click",'span',function(event){
  //to remove the li we use the parent......
  $(this).parent().fadeOut(1000,function(){
    $(this).remove();
  });
  event.stopPropogation();
});

$('input[type = "text"]').keypress(function(event){
  if(event.which === 13){
      var todot = $(this).val();
      $(this).val("");
      $('ul').append("<li><span> <i class = 'fa fa-trash'></i> </span>" + todot +"</li>");

  }
});

$('.fa-plus').on("click",function(){

    $('input[type="text"]').fadeToggle("slow");


});
