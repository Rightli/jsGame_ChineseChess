//预加载图片资源

$.cacheImg('piecesPng','../img/checkerpng/pieces.png');

$(function(){
	$('#table').canvas('table').autoAnimation(false);
	$('#piecestable').canvas('piecestable');

	$("#gamestartscreen")[0].style.display="block";
	
    btnInit();
    player.init();
   
});


function viewInit(){
	
	 // setTimeout(function(){
    	// if( player.me().position == 0 ){
	    	 // player.isYouOrder = true ;
	    // }
// 	    
	    // //显示玩家身份
	    // $('$table').entity('identity', {
			// dx : $('$table').left('3%'),
			// dy : $('$table').top('3%'),
			// w : ($('$table').left('90%')/15)*0.5,
			// h : ($('$table').left('90%')/15)*0.5,
		// }).res(["black","white"][player.me().position]).draw();
// 	    
    // },1000);
		
		    $('$table').entity("grid",{
				dx : player.canvasBasex ,
				dy : player.canvasBasey ,
				w : player.gap*8 ,
				h : player.gap*9 ,
			}).table(8,9).down().onDrawComplete(function(){
				//画对角线
				var DiagonalLine = [[3,0,5,2],[5,0,3,2],[3,9,5,7],[5,9,3,7]];
				var DiagonalLineArr = game._assembleConfig( DiagonalLine );
				$('$table').line(DiagonalLineArr);
				
				//楚河，汉界
				game._boundary();
			}).listen('oncross',function(column,row){
				
				var gap = (this.data('w')/8),
				x = this.data('dx')+(column-1)*gap,
				y = this.data('dy')+(row-1) * gap;
				game.canvasEvent( x ,y );
			}).draw();
	
			//画悔棋按钮
			var style = {
				rect : {
					'fillcolor':'#fff',
					'r' : 5
				},
				text : {
					'name' : '悔棋',
					'color':'#888',
					'size' : 16 ,
				},
				
			};
			
			$('$table').entity('back', {
				dx : $('$table').left('20%'),
				dy : $('$table').top('3%'),
				w : $('$table').left('10%'),
				h : $('$table').left('6%'),
			}).button(style ,game.back ).draw();
	
	
}


window.lconready = function(){ 
	//玩家都到位触发ready事件之后
	
    $("#gamestartscreen")[0].style.display="none";
	$("#mainScreen")[0].style.display="block";
	
	viewInit();
    game.init();
   
    

}  ;