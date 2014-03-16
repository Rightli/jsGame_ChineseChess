
//为button注册事件监听器

function btnInit(){
	$("#start")[0].addEventListener("click",btnAction.disappear( $("#start")[0].parentNode ),false);
    $("#quit")[0].addEventListener("click",btnAction.disappear( $("#quit")[0].parentNode ),false);
    $("#start")[0].addEventListener("click",btnAction.ready,false);
    $("#quit")[0].addEventListener("click",btnAction.quit,false);
	
	$("#playAgain")[0].addEventListener("click",btnAction.disappear( $("#playAgain")[0].parentNode.parentNode ),false);
    $("#close")[0].addEventListener("click",btnAction.disappear( $("#close")[0].parentNode.parentNode ),false);
    $("#playAgain")[0].addEventListener("click",btnAction.playAgain,false);
    $("#close")[0].addEventListener("click",btnAction.close,false);
}


var btnAction = {
    ready: function(){
        $.lc.ready(); 
    },
    quit: function(){
       // console.log("bye");
    },
    disappear: function(e){
        return function(){
              e.style.display = "none";
        };
    },
   
    playAgain : function(){
    	
    	$("$piecestable").clearAll(); //?clear了什么？
    	
    	player.init();
    	viewInit();
    	game.init();
    },
   
};


