
//预加载图片资源

$.cacheImg('checkerboard','../img/checkerpng/checkerboard.png');
$.cacheImg('piecesPng','../img/checkerpng/pieces.png');

$(function(){
	//dom加载完成后就可初始化Canvas
	
    $("#table").canvas("table");
    
    
});

var CheckerPlayer = {
	me : null ,	     //position 黑棋(0)   or 白棋(1)
	position : null ,
	isYouOrder : null ,    // 控制出牌顺序--->默认是false
	myCurrPieces : null, //玩家当前自己的棋子
	otherPiecesArr : null, //对家当前的棋子
	currCell : null, //当前自己操作的棋盘格信息
	othercurrCell : null, //当前对家操作的棋盘格信息
	myDropsObj : [], //着落点数组
	otherDropsObj : [], //着落点数组
	boardLength : null,//棋盘的边长
	gap : null, //棋盘格的边长
	line : 10,//棋盘的横线数，竖线数
	row : 9,
	canvasBasex : null , //canvas左上角起点坐标
	canvasBasey : null ,
	myColor : null,
	otherColor : null ,
	num : 0,
	
	init : function(){
		 CheckerPlayer.me = function(){
			//return JSON.parse($.lc.self()); //JSON.parse
			return $.lc.self(); //JSON.parse
		};
		CheckerPlayer.isYouOrder = false ;
		CheckerPlayer.myCurrPieces = [];
		CheckerPlayer.otherPiecesArr = [];
		CheckerPlayer.num = 0;
		CheckerPlayer.currCheckerOther = null;
		CheckerPlayer.myCheckerArr = [];
		
			
		$('#mainScreen')[0].setAttribute('width',Config.getInstance().width + 'px');
        $('#mainScreen')[0].setAttribute('height',Config.getInstance().height + 'px');
        $('#backImg')[0].setAttribute('width',Config.getInstance().width + 'px');
        $('#backImg')[0].setAttribute('height',Config.getInstance().height + 'px');
		
        $("$table").width( Config.getInstance().width );
        $("$table").height( Config.getInstance().height );
        
        CheckerPlayer.canvasBasex = $("$table").left("5%") ;
		CheckerPlayer.canvasBasey = $("$table").top("10%");
		CheckerPlayer.gap = $('$table').left('11.25%');
	},
};

var posConfig = {
	canvasScope : {},
	myJSScope : {}, //jiang与shi
	init : function(){
		posConfig.canvasScope = {
			minX : CheckerPlayer.canvasBasex ,//?( -gap*0.4 )
			maxX : CheckerPlayer.canvasBasex + CheckerPlayer.gap*8 , 
			minY : CheckerPlayer.canvasBasey,
			maxY : CheckerPlayer.canvasBasey + CheckerPlayer.gap*9,
		};
		posConfig.myJSScope = {
			minX : CheckerPlayer.canvasBasex + CheckerPlayer.gap*3 ,//?( -gap*0.4 )
			maxX : CheckerPlayer.canvasBasex + CheckerPlayer.gap*5 , 
			minY : CheckerPlayer.canvasBasey + CheckerPlayer.gap*7,
			maxY : CheckerPlayer.canvasBasey + CheckerPlayer.gap*9,
		};
	},
};

var game = {
	
	init : function(){
		
		posConfig.init();
		game._identity(); //显示玩家身份
		//game.drawBoard( CheckerPlayer.myCheckerArr );
		$('$table').entity("grid",{
			dx : CheckerPlayer.canvasBasex,
			dy : CheckerPlayer.canvasBasey,
			dw : CheckerPlayer.gap*8 ,
			dh : CheckerPlayer.gap*9,
		}).shape(game.drawBoard).draw().tap(game.canvasEvent,false);
		
		CheckerPlayer.myDropsObj = game.initDrops( 1 );
		CheckerPlayer.otherDropsObj = game.initDrops( 0 );
		game.drawPieces( CheckerPlayer.myDropsObj ,CheckerPlayer.myColor);
		game.drawPieces( CheckerPlayer.otherDropsObj ,CheckerPlayer.otherColor);
		$("$table").tap( game.canvasEvent , false ) ;
	},
	
	_identity : function(){
		CheckerPlayer.num++;
		var position = ( CheckerPlayer.me().position + CheckerPlayer.num )/2 ;
		if( position == 1){
			CheckerPlayer.myColor = "red";
			CheckerPlayer.otherColor = "black";
			CheckerPlayer.isYouOrder = true;
		}else{
			CheckerPlayer.myColor = "black";
			CheckerPlayer.otherColor = "red";
			CheckerPlayer.isYouOrder = false;
		}
	},
	_posXY : function( x ,y ,gap ,bool ){ //bool=0--->加上gap*0。4
		gap = gap || CheckerPlayer.gap ;
		bool = bool || 0 ;
		var str ; 
		if( bool == 0 ){
			console.log("shi-");
			str = {
				x : x - gap*0.4,
				y : y - gap*0.4,
			};
		}else {
			console.log("shi+");
			str = {
				x : x + gap*0.4,
				y : y + gap*0.4,
			};
		}
		return str ; 
	},
	
	drawPieces : function( obj ,color ){
			for( value in obj ){
				var val = obj[ value ];
				if( val.initPieces!="" && val.tag==1){ //
					var config = NormalPieces.data[ val.initPieces ][color];
					var gap = CheckerPlayer.gap;
					var pos = game._posXY( val.x ,val.y , gap );
					$.extend(config,{dx: pos.x ,dy : pos.y ,dw : gap*0.9 ,dh : gap*0.9});
					
					$( "$table" ).entity( color+"_"+val.initPiecesName , config ).res('piecesPng').draw()
					.tap( game.piecesEvent,false );					
				}
			}
		
	},
	
	_assembleDropsArr : function( str , pos ){ //初始化棋子总共着落点
		str = str || {};
		str.type = str.type || 0 ; //默认是上着落点?
		str.line = str.line || 10 ;
		str.row = str.row || 9 ;
		var dropsArr = {} ,numBing = 0;
		var piecesName = ["che","ma","xiang","shi","jiang","shi","xiang","ma","che"];
		var pNameArr = ["che1","ma1","xiang1","shi1","jiang","shi2","xiang2","ma2","che2"];
		var num = 1;
		for( var i = 0 ; i< Math.floor( str.line/2 ) ;i++){
			for( var j = 0 ; j< str.row ;j++){
				
				var x , y ,tag=0,initPieces,name;
				if( str.type == 0 ){
					x = pos.x + pos.gap*j ; y = pos.y + pos.gap*i ;
				}else{
					x = pos.x - pos.gap*j ; y = pos.y - pos.gap*i ;
				}
				 
				//初始化棋子位置
				if(i==0){
					initPieces = piecesName[j];name = pNameArr[j];tag = 1;
				}else if( i==2 ){
					if(j ==1){
						initPieces = "pao";name = "pao1";tag = 1;
					}else if( j==7 ){
						initPieces = "pao";name = "pao2";tag = 1;
					}else{
						initPieces = "";name = "";tag = 0;
					}
					
				}
				else if( i==3 ){
					if(j%2==0){
						initPieces = "bing";
						name = "bing" +numBing;
						numBing++;
						tag = 1;
					}else{
						initPieces = "";name = "";tag = 0;
					}
					
				}else{
					initPieces = "";name = "";
					tag = 0;
				}
				//i == (0||2||3)?tag=1:tag=0;
				dropsArr[x+"_"+y] = {
					x : x,
					y : y,
					num : num ,
					type : str.type ,
					tag : tag, //是否有棋子 
					initPieces : initPieces ,
					initPiecesName : name ,
					
				};
				num++;
			}
		}
		return dropsArr;
	},
	
	initDrops : function( type ){ 
		//初始化玩家自己和对家的着落点数组
		var posStart,
			str = {
				type : type ,
				line : CheckerPlayer.line,
				row : CheckerPlayer.row,
			};
		if( type==0 ){
			posStart = {//上着落点的初始位置
					x : CheckerPlayer.canvasBasex,
					y : CheckerPlayer.canvasBasey,
					gap : CheckerPlayer.gap,
				};
		}else{
				posStart = {//下着落点的初始位置
					x : CheckerPlayer.canvasBasex+CheckerPlayer.gap*8,
					y : CheckerPlayer.canvasBasey+CheckerPlayer.gap*9,
					gap : CheckerPlayer.gap,
				};
		}
		
		return game._assembleDropsArr( str , posStart);
	},
	
	_assembleConfig : function( configArr ){ 
		//期盼对角线点数组
		var arr = [];
		var len = configArr.length;
		for( var i = 0;i<len ;i++){
			//组装对角线坐标
			var num = configArr[i];
			var str = [
				num[0]*CheckerPlayer.gap + CheckerPlayer.canvasBasex,
				num[1]*CheckerPlayer.gap + CheckerPlayer.canvasBasey,
				num[2]*CheckerPlayer.gap + CheckerPlayer.canvasBasex,
				num[3]*CheckerPlayer.gap + CheckerPlayer.canvasBasey,
			];
			arr.push( str );
		}
		return arr ;
		
	},
	_boundary : function(){//楚河，汉界{（1，4）w=7，h=1}
		var y = 4*CheckerPlayer.gap + CheckerPlayer.canvasBasey;
		for(var i=0;i<7;i++){
			var x = (1+i)*CheckerPlayer.gap + CheckerPlayer.canvasBasex-2;
			$('$table').entity( "boundary" , {} ).shape( function(){
				var option = this[0],cxt = this.context;
		        cxt.clearRect( x,y,3,CheckerPlayer.gap );
			} ).draw();
		}
	},
	
	drawBoard : function(  ){ //画棋盘
		var points = []; //画线的点
		for(var i=0;i<CheckerPlayer.line;i++){ 
			//画横线
			var x1 = $('$table').left('5%'),
			y1 = $('$table').top('10%') + i*$('$table').left('11.25%'),
			x2 = $('$table').left('95%');
			points.push( [x1,y1,x2,y1] ) ;
		}
		for(var i=0;i<CheckerPlayer.row;i++){ 
			//画竖线
			var tx1 = $('$table').left('5%')+i*$('$table').left('11.25%'),
			ty1 = $('$table').top('10%') ,
			ty2 = $('$table').top('10%') + $('$table').left('11.25%')*9;
			points.push( [tx1,ty1,tx1,ty2] ) ;
		}
		//画对角线
		var DiagonalLine = [[3,0,5,2],[5,0,3,2],[3,9,5,7],[5,9,3,7]];
		var DiagonalLineArr = game._assembleConfig( DiagonalLine );
		
		points = points.concat( DiagonalLineArr );
		$('$table').line(points);
		
		//楚河，汉界
		game._boundary();
	},
	
	changeTag: function( arr ){//更新着落点tag的值arr=[{key:,data:[]},{}]
		var tagArr = [0,1];
		var dropArr = [];
		
		arr.forEach(function( value , index){
				var name = value.data[0]+"_"+value.data[1];
				if ( CheckerPlayer.myDropsObj[name] ){
					CheckerPlayer.myDropsObj[name].tag=tagArr[value.key];
					//console.log("dropName:" + JSON.stringify(CheckerPlayer.myDropsObj[name]));
					dropArr[index] = CheckerPlayer.myDropsObj[name] ;
				}else{
					if( CheckerPlayer.otherDropsObj[name] ){
						//console.log("dropName:" + JSON.stringify(CheckerPlayer.otherDropsObj[name]));
						CheckerPlayer.otherDropsObj[name].tag=tagArr[value.key];
						dropArr[index] = CheckerPlayer.otherDropsObj[name] ;
					}
				}
		});
		
		return dropArr;
	},
	
	updatePieces : function( x , y ){
		//remove--->CheckerPlayer.myCurrPieces[1]
		// move---->CheckerPlayer.myCurrPieces[0]置
		$("$table@"+CheckerPlayer.myCurrPieces[1].id).remove();
		$( "$table@"+ CheckerPlayer.myCurrPieces[0].id).animation().to({
						dx : x, //已经ensure好着落点
						dy : y,
					},100).start();
		
	},
	
	clearCurrPieces : function(){
		CheckerPlayer.myCurrPieces[0] = null ;
		CheckerPlayer.myCurrPieces[1] = null ;
	},
	
	notifyPiecesEvt : function( dropArr ){
		//alert(dropArr[0].num);
		var notifyStr = {
			 		eventTag : "updatePieces" ,
			 		from : CheckerPlayer.me(),
			 		data : { 
			 			'dropNum' : [ dropArr[0].num ,dropArr[1].num ],
			 			'piecesName' : [CheckerPlayer.myCurrPieces[0].id ,CheckerPlayer.myCurrPieces[1].id],
			 		},
			 };
		console.log ("str:"+JSON.stringify(notifyStr));
		game.notifyAll( notifyStr );
	},
	
	piecesEvent : function( context , x ,y ){
		var currEntity = $( context ).entity(this.id)[0]; //当前点击棋子的信息
		var gap = CheckerPlayer.gap;
		if( CheckerPlayer.isYouOrder ){
			if( currEntity.color == CheckerPlayer.myColor ){
				CheckerPlayer.myCurrPieces[0] = currEntity ;
			}else{
				if( !!CheckerPlayer.myCurrPieces[0] ){
					var pos1 = game._posXY( CheckerPlayer.myCurrPieces[0].dx,CheckerPlayer.myCurrPieces[0].dy,gap,1);				
					var pos2 = game._posXY( currEntity.dx,currEntity.dy,gap ,1);
					var x1 = pos1.x ,y1 = pos1.y ,x2 = pos2.x ,y2 = pos2.y ,
			 			type = CheckerPlayer.myCurrPieces[0].piecesType ;
			 			
			 		var judge = game.judge( x1,y1,x2,y2,type );
			 		if( judge ){
			 			game.clearCurrPieces();
			 		}else{
			 			
			 			CheckerPlayer.myCurrPieces[1] = currEntity;
			 			game.updatePieces( currEntity.dx,currEntity.dy );
			 			
			 			//var dropArr = game.changeTag([{key:0,data:[x1,y1]},{key:1,data:[x2,y2]}]);
			 			// console.log('dropArr:');
			 			// console.log(dropArr);
			 			//game.notifyPiecesEvt(dropArr);
			 			
			 			game.clearCurrPieces();	
			 		}
				}
			}
		}
		
	},
	
	canvasEvent : function( context , x,y ){
		var gap = CheckerPlayer.gap;
		var posDrop = game.ensurePos(x,y); //对应着落点坐标
		var pos = game._posXY( posDrop[0] , posDrop[1] );//对应棋子在棋盘上的坐标
		var currP = CheckerPlayer.myCurrPieces[0];
		var posCurr = game.ensurePos( currP.dx+gap*0.4,currP.dy+gap*0.4 );
		
		if( currP&&currP!="" ){
			var x1 = posCurr[0] ,
			 	y1 = posCurr[1],
			 	x2 = posDrop[0],
			 	y2 = posDrop[1] ,
			 	type = currP.piecesType ;
			 	var judge = game.judge( x1,y1,x2,y2,type );
			 	if( judge ){
			 		$( "$table@"+ currP.id).animation().to({
						dx : pos.x, //已经ensure好着落点
						dy : pos.y,
					},100).start();
					//将相应着落点tag更新,
					game.changeTag([{key:0,data:[x1,y1]},{key:1,data:[posDrop[0],posDrop[1]]}]);

					CheckerPlayer.myCurrPieces[0] = null ;
			 	}else{
			 		CheckerPlayer.myCurrPieces[0] = null ;
			 		CheckerPlayer.myCurrPieces[1] = null ;
			 	}
			
		}
	},
	
	judge : function( x1,y1,x2,y2,type ){
		 //判断坐标范围是否合理
		 
		if ( x1 >= posConfig.canvasScope.minX && x2 >= posConfig.canvasScope.minX 
				&& x1 <= posConfig.canvasScope.maxX&& x2 <= posConfig.canvasScope.maxX &&
				y1 >=posConfig.canvasScope.minY &&y2 >=posConfig.canvasScope.minY &&
				 y1 <= posConfig.canvasScope.maxY&&y2 <= posConfig.canvasScope.maxY ){
					
					var pos = {
					 	x1 : x1 ,
					 	y1 : y1 ,
					 	x2 : x2 ,
					 	y2 : y2 ,
					 };
				var judge = new CheckerJudge( type ,pos );
				return judge[ type ]();	 
					
				} 
				
			 		
	},
	
	ensurePos : function( x,y ){ //确定相应坐标的着落点
			var gap = CheckerPlayer.gap;
			var n1,n2,m1,m2,posArr=[];
		
			m1 = ( x - CheckerPlayer.canvasBasex ) % gap ;
			n1 = Math.floor( ( x - CheckerPlayer.canvasBasex ) / gap )*gap+CheckerPlayer.canvasBasex ;
			n2 = Math.floor( ( y - CheckerPlayer.canvasBasey ) / gap )*gap+CheckerPlayer.canvasBasey ;
			m2 = ( y - CheckerPlayer.canvasBasey ) % gap ;
			
			m1<=(gap/2)&&m2<=(gap/2)?posArr=[n1,n2]:
			m1<=(gap/2)&&m2>(gap/2)?posArr=[n1,n2+gap]:
			m1>(gap/2)&&m2<=(gap/2)?posArr=[n1+gap,n2]:
			m1>(gap/2)&&m2>(gap/2)?posArr=[n1+gap,n2+gap]:posArr=[];
			
			return posArr;
	},
	
	notifyAll : function( str ){
		$.lc.notify('all', {
                'eventTag' : str.eventTag ,
                'from' : str.from ,
                'data' : str.data ,
            });
	},
	
	back : function(){ //悔棋响应函数
		if( !CheckerPlayer.isYouOrder){
			//var currPieces = CheckerPlayer.currPiecesArr.pop();
			$.lc.notify('all', {
                'eventTag' : 'goback' ,
                'from' : CheckerPlayer.me() ,
                //'data' : currPieces,
            });
			
			return ;
		}
	},
	
};

$.addRemoteEventListener('updatePieces', function(event){
	alert("hello");
    var who = event.from.position ;
    var data = event.data ;
    
    if (who !== CheckerPlayer.me().position ){
    	CheckerPlayer.isYouOrder = true;
    	
    	
    }

});
// $.addRemoteEventListener('dropPieces', function(event){
    // var who = event.from.position ;
    // var data = event.data ;
    // var piecesName = "pieces"+data.name;
    // var checkerName = "checker"+data.name;
    // if (who !== CheckerPlayer.me().position ){
    	// CheckerPlayer.isYouOrder = true;
    	// //保存对家棋子和棋盘格信息
    	// CheckerPlayer.currPiecesArrOther.push( piecesName );
    	// CheckerPlayer.currCheckerOther = checkerName;
//     	
    	// var XY = game._caculateXY( data.name , CheckerPlayer.gap );
    	// var str = {"dw" : CheckerPlayer.gap*0.8,"dh": CheckerPlayer.gap*0.8,"dx": XY.dx,"dy":XY.dy};
    	// $.extend(data.options,str);
//     	
    	// game.drawPieces( piecesName , data.options , CheckerPlayer.colors[who]  );
    	// game.unbindEvent( checkerName );
    // }
// 
// });
// 
// $.addRemoteEventListener('successEvent', function(event){
	// $("#again")[0].style.display = "block" ;
	// var e = document.getElementById("successInfo");
	// CheckerPlayer.isYouOrder = false;
	// e.innerHTML = event.data.info;
// });
// 
// $.addRemoteEventListener('goback', function(event){ //悔棋事件
	// //删除当前棋子，为当前棋盘格重新绑定事件 ，为当前玩家isOrder置为true，对家置为false
	// var currPieces = CheckerPlayer.currPiecesArr.pop();
	// var currCherker = CheckerPlayer.currChecker ;
	// var currPiecesOther = CheckerPlayer.currPiecesArrOther.pop();
	// var currCherkerOther = CheckerPlayer.currCheckerOther ;
	// var who = event.from.position ;
// 	
	// if( who == CheckerPlayer.me().position ){
		// CheckerPlayer.isYouOrder = true ;
		// game.removePieces(currPieces.id);
		// game.bindEventOne( currCherker.name );
	// }else{
		// CheckerPlayer.isYouOrder = false ;
		// game.removePieces(currPiecesOther);
		// game.bindEventOne( currCherkerOther );
	// }
// });


