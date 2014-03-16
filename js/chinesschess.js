

var player = {
	me : null ,	     //position 黑棋(0)   or 白棋(1)
	//position : null ,
	isYouOrder : null ,    // 控制玩家顺序--->默认是false
    myCurrPieces : null ,
	back : { my : { Arr : null, pos : null },
			other : { Arr : null, pos : null }}, //悔棋操作
	myDropsObj : [], //着落点数组
	otherDropsObj : [], 
	gap : null, //棋盘格的边长
	line : 10,//棋盘的横线数，竖线数
	row : 9,
	canvasBasex : null , //canvas左上角起点坐标
	canvasBasey : null ,
	myColor : null,
	otherColor : null ,
	num : 0,
	
	init : function(){
		 player.me = function(){
			 //return JSON.parse($.lc.self()); //JSON.parse
			 return $.lc.self(); 
		};
		player.isYouOrder = false ;
		player.myCurrPieces = [];
		player.back.my.Arr = [];
		player.back.other.Arr = [];
			
		$('#mainScreen')[0].setAttribute('width',Config.getInstance().width + 'px');
        $('#mainScreen')[0].setAttribute('height',Config.getInstance().height + 'px');
        $('#backImg')[0].setAttribute('width',Config.getInstance().width + 'px');
        $('#backImg')[0].setAttribute('height',Config.getInstance().height + 'px');
		
        $("$table").width( Config.getInstance().width );
        $("$table").height( Config.getInstance().height );
        $("$piecestable").width( Config.getInstance().width );
        $("$piecestable").height( Config.getInstance().height );
        
        player.canvasBasex = $("$table").left("5%") ;
		player.canvasBasey = $("$table").top("10%");
		player.gap = $('$table').left('11.25%');
	},
};

var posConfig = {
	canvasScope : {},
	myJSScope : {}, //jiang与shi
	init : function(){
		posConfig.canvasScope = {
			minX : player.canvasBasex ,//?( -gap*0.4 )
			maxX : player.canvasBasex + player.gap*8 , 
			minY : player.canvasBasey,
			maxY : player.canvasBasey + player.gap*9,
		};
		posConfig.myJSScope = {
			minX : player.canvasBasex + player.gap*3 ,//?( -gap*0.4 )
			maxX : player.canvasBasex + player.gap*5 , 
			minY : player.canvasBasey + player.gap*7,
			maxY : player.canvasBasey + player.gap*9,
		};
	},
};

var game = {
	
	init : function(){
		
		posConfig.init();
		game._identity(); //显示玩家身份
		
		//game.drawPiecesTest();
		player.myDropsObj = game.initDrops( 1 );
		player.otherDropsObj = game.initDrops( 0 );
		game.drawPieces( player.myDropsObj ,player.myColor); //画玩家棋子
		game.drawPieces( player.otherDropsObj ,player.otherColor); //画对家棋子	
		
	},
	
	_identity : function(){
        //计算得出玩家的身份

		player.num++;
		var position = ( player.me().position + player.num ) % 2 ;
		if( position == 1){
			player.myColor = "red";
			player.otherColor = "black";
			player.isYouOrder = true;
		}else{
			player.myColor = "black";
			player.otherColor = "red";
			player.isYouOrder = false;
		}
	},

	_posXY : function( x ,y ,gap ,bool ){
	    //bool=0--->加上gap*0。4
        //棋子的左上角坐标确定，使棋子落在中点

		gap = gap || player.gap ;
		bool = bool || 0 ;
		var str ; 
		if( bool == 0 ){
			str = {
				x : x - (gap*0.4),
				y : y - (gap*0.4),
			};
		}else {
			str = {
				x : x + (gap*0.4),
				y : y + (gap*0.4),
			};
		}
		return str ; 
	},
	
	drawPieces : function( obj ,color ){
			for( value in obj ){
				var val = obj[ value ];
				if( val.initPieces!="" && val.tag==1){ //
					var config = NormalPieces.data[ val.initPieces ][color] ,
					    gap = player.gap ,
					    pos = game._posXY( val.x ,val.y , gap ) ;
					    $.extend(config,{dx: pos.x ,dy : pos.y ,dw : gap*0.9 ,dh : gap*0.9});
					
					$( "$piecestable" ).entity( color+"_"+val.initPiecesName , config ).res('piecesPng').up().draw()
					.tap( game.piecesEvent,false );					
				}
			}
		
	},
	
	// drawPiecesTest : function(  ){
			// var piecesName = ["che","ma","xiang","shi","jiang","shi","xiang","ma","che"] ;
// 		    
			// for( var i = 1;i <= 8 ; i++){
				// var index = i%9 ;
				// var name = piecesName[index] ;
			 	// var config = NormalPieces.data[ name ]["red"] ,
			 	// gap = player.gap ,
			 	// x = player.canvasBasex+(i-1)*gap,
			 	// y = player.canvasBasey+(i-1)*gap;
// 			 	
			 	 // $.extend(config,{dx: x ,dy : y ,dw : gap*0.9 ,dh : gap*0.9});
				// $( "$piecestable" ).entity( name+"_"+i , config ).res('piecesPng').up().draw()
					// .tap( game.piecesEventText,false );	
			// }
// 		
	// },
	
	_assembleDropsArr : function( str , pos ){
	    //初始化棋子总共着落点

		str = str || {};
		str.type = str.type || 0 ; //默认是上着落点?
		str.line = str.line || 10 ;
		str.row = str.row || 9 ;
		var dropsArr = {} ,numBing = 0;

        //piecesName对应于NormalPieces，确定棋子在精灵图上的位置参数
        //piecesEntityname对应于棋子实体（生成entity时）
		var piecesName = ["che","ma","xiang","shi","jiang","shi","xiang","ma","che"] ,
		     piecesEntityname = ["che1","ma1","xiang1","shi1","jiang","shi2","xiang2","ma2","che2"] ,
		     num = 1; //着落点num属性1~45

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
					initPieces = piecesName[j];name = piecesEntityname[j];tag = 1;
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
				line : player.line,
				row : player.row,
			};
		if( type==0 ){
			posStart = {//上着落点的初始位置
					x : player.canvasBasex,
					y : player.canvasBasey,
					gap : player.gap,
				};
		}else{
				posStart = {//下着落点的初始位置
					x : player.canvasBasex+player.gap*8,
					y : player.canvasBasey+player.gap*9,
					gap : player.gap,
				};
		}
		
		return game._assembleDropsArr( str , posStart);
	},
	
	_assembleConfig : function( configArr ){ 
		//棋盘对角线点数组
		var arr = [];
		var len = configArr.length;
		for( var i = 0;i<len ;i++){
			//组装对角线坐标
			var num = configArr[i];
			var str = [
				num[0]*player.gap + player.canvasBasex,
				num[1]*player.gap + player.canvasBasey,
				num[2]*player.gap + player.canvasBasex,
				num[3]*player.gap + player.canvasBasey,
			];
			arr.push( str );
		}
		return arr ;
		
	},
	_boundary : function(){//楚河，汉界{（1，4）w=7，h=1}
		var y = 4*player.gap + player.canvasBasey;
		for(var i=0;i<7;i++){
			var x = (1+i)*player.gap + player.canvasBasex-2;
			$('$table').entity( "boundary" , {} ).shape( function(){
				var option = this[0],cxt = this.context;
		        cxt.clearRect( x,y,3,player.gap );
			} ).draw();
		}
	},
	
	// drawBoard : function(  ){ //画棋盘
		// var points = []; //画线的点
		// for(var i=0;i<player.line;i++){ 
			// //画横线
			// var x1 = $('$table').left('5%'),
			// y1 = $('$table').top('10%') + i*$('$table').left('11.25%'),
			// x2 = $('$table').left('95%');
			// points.push( [x1,y1,x2,y1] ) ;
		// }
		// for(var i=0;i<player.row;i++){ 
			// //画竖线
			// var tx1 = $('$table').left('5%')+i*$('$table').left('11.25%'),
			// ty1 = $('$table').top('10%') ,
			// ty2 = $('$table').top('10%') + $('$table').left('11.25%')*9;
			// points.push( [tx1,ty1,tx1,ty2] ) ;
		// }
		// //画对角线
		// var DiagonalLine = [[3,0,5,2],[5,0,3,2],[3,9,5,7],[5,9,3,7]];
		// var DiagonalLineArr = game._assembleConfig( DiagonalLine );
// 		
		// points = points.concat( DiagonalLineArr );
		// $('$table').line(points);
// 		
		// //楚河，汉界
		// game._boundary();
	// },
// 	
	changeTag: function( arr ){//更新着落点tag的值arr=[{key:,data:[]},{}]
		var tagArr = [0,1];
		var dropArr = [];
		
		arr.forEach(function( value , index){
				var name = value.data[0]+"_"+value.data[1];
				if ( !!player.myDropsObj[name] ){
					player.myDropsObj[name].tag=tagArr[value.key];
					dropArr[index] = player.myDropsObj[name] ;
				}else{
					if( !!player.otherDropsObj[name] ){
						player.otherDropsObj[name].tag=tagArr[value.key];
						dropArr[index] = player.otherDropsObj[name] ;
					}
				}
		});
		
		return dropArr;
	},
	
	findByNum: function( num ,type ){
	    //根据num,type找到棋盘上相应的着落点dx,dy

		var my = player.myDropsObj ;
		var other = player.otherDropsObj ;
		if(type == 0 ){
			for( value in  my ){
				var val = my[ value ];
				if( val.num == num ){ //
					return val;				
				}
			}
		}else if( type == 1 ){
			for( value in  other ){
				var val = other[ value ];
				if( val.num == num ){ //
					return val;				
				}
			}
		}
		
		
		return null;
	},
	
	updatePieces : function( x , y ){
		//remove--->player.myCurrPieces[1]
		// move---->player.myCurrPieces[0]置
		
		$("$piecestable@"+player.myCurrPieces[1].id).remove();
		$( "$piecestable@"+ player.myCurrPieces[0].id).animation().to({
						dx : player.myCurrPieces[1].dx, //已经ensure好着落点
						dy : player.myCurrPieces[1].dy,
					},100).start();
		
	},
	
	clearCurrPieces : function(){
		player.back.my.Arr = [].concat( player.myCurrPieces );//悔棋使用
		player.myCurrPieces = [];
	},
	
	SuccessJiang : function(){
		$.lc.notify('all', {
			                'eventTag' : 'jiangEvt' ,
			                'from' : player.me() ,
			            });
	},
	
	piecesEvent : function( x ,y ){
		
		var currEntity = this.data(); //当前点击棋子的信息
		var gap = player.gap;
		if( player.isYouOrder ){
			if( currEntity.color == player.myColor ){
				player.myCurrPieces[0] = currEntity ;
				return ;
			}else{
				if( !!player.myCurrPieces[0] ){
					var posM1 = game._posXY( player.myCurrPieces[0].dx,player.myCurrPieces[0].dy,gap,1);				
					var posM2 = game._posXY( currEntity.dx,currEntity.dy,gap ,1);
					var pos1 = game.ensurePos( posM1.x ,posM1.y),
						pos2 = game.ensurePos( posM2.x ,posM2.y);
					
					var x1 = pos1[0] ,y1 = pos1[1] ,x2 = pos2[0] ,y2 = pos2[1] ,
			 			type = player.myCurrPieces[0].piecesType ;
					
			 		var judge = game.judge( x1,y1,x2,y2,type );
			 		
			 		if( judge ){
			 			player.myCurrPieces[1] = currEntity;
			 			
			 			if( currEntity.piecesType == "jiang" ){
			 				game.SuccessJiang();
			 			}
			 			game.updatePieces( currEntity.dx,currEntity.dy );
			 			
			 			var dropArr = game.changeTag([{key:0,data:[x1,y1]},{key:1,data:[x2,y2]}]);
			 			 $.lc.notify('all', {
			                'eventTag' : 'piecesEvt' ,
			                'from' : player.me() ,
			                'data' : {
			                	dropNum : dropArr[1].num,
			                	dropType : dropArr[1].type,//
			                	deleteName : currEntity.id,
			                	moveName : player.myCurrPieces[0].id,
			                },
			            });
			 		}else{
			 		}
			 		game.clearCurrPieces();	
				}
				return ;
			}
		}
		
	},
	
	canvasEvent : function( x,y ){
		var gap = player.gap ,
		pos = game._posXY( x , y ) ,//对应棋子在棋盘上的坐标
		currP = player.myCurrPieces[0];
		
		if( !!currP ){
			var posXY = game._posXY( currP.dx,currP.dy,gap,1 ) ,
			posCurr = game.ensurePos( posXY.x ,posXY.y );
 			
			var x1 = posCurr[0] ,
			 	y1 = posCurr[1] ,
			 	x2 = x ,
			 	y2 = y ,
			 	type = currP.piecesType ;
			 	var judge = game.judge( x1,y1,x2,y2,type );
			 	
			 	if( judge ){
			 		$( "$piecestable@"+ currP.id).animation().to({
						 dx : pos.x, 
						 dy : pos.y,
					},100).start();
					
					//console.log("entity:" + JSON.stringify( $( "$piecestable").entity()));
					
					//将相应着落点tag更新,
					var dropArr = game.changeTag([{key:0,data:[x1,y1]},{key:1,data:[x2,y2]}]);
					
					$.lc.notify('all', {
		                'eventTag' : 'canvasEvt' ,
		                'from' : player.me() ,
		                'data' : {
		                	dropNum : dropArr[1].num,
		                	dropType : dropArr[1].type,//
		                	piecesName : currP.id,
		                },
		            });
					
			 	}else{
			 	}
			game.clearCurrPieces();	
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
				
				player.back.my.pos = pos ;
				
				var judge = new CheckerJudge( pos );
				return judge[ type ]();	 
					
				} 
				
			 		
	},
	
	ensurePos : function( x,y ){
	        //确定相应坐标的着落点
			var gap = player.gap;
			var n1,n2,m1,m2,posArr=[];
		
			m1 = ( x - player.canvasBasex ) % gap ;
			n1 = parseInt( ( x - player.canvasBasex ).toFixed(2) / gap )*gap+player.canvasBasex ;
			n2 = parseInt( ( y - player.canvasBasey ).toFixed(2) / gap )*gap+player.canvasBasey ;
			m2 = ( y - player.canvasBasey ) % gap ;
			
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
		if( !player.isYouOrder){
			//var currPieces = player.currPiecesArr.pop();
			$.lc.notify('all', {
                'eventTag' : 'goback' ,
                'from' : player.me() ,
                //'data' : currPieces,
            });
		}
	},
	
	move : function( name ,x ,y ){
		$( name ).animation().to({
						dx : x, 
						dy : y,
					},100).start();
	},
	
};

$.addRemoteEventListener('jiangEvt', function(event){
	var who = event.from.name ; 
	
	$("#again")[0].style.display = "block" ;
	player.isYouOrder = false;
    
    var e = document.getElementById("successInfo");
	e.innerHTML = who + "Success";

});

$.addRemoteEventListener('canvasEvt', function(event){
	player.isYouOrder = false;
    var who = event.from.position ;
    var num = event.data.dropNum ,
    	name = event.data.piecesName ,
    	type = event.data.dropType ;
    
    if (who !== player.me().position ){
    	player.isYouOrder = true;
    	var drop = game.findByNum( num ,type ) ,
    	x = $("$piecestable@"+name).data().dx ,
    	y = $("$piecestable@"+name).data().dy ,
    	piecesPos = game.ensurePos( x ,y );
    	
    	if( !!drop ){
    		var pos = game._posXY( drop.x ,drop.y );
					
    		player.back.other.Arr[0] = $("$piecestable@"+name).data();
    		player.back.other.pos = {x1: x , y1 :y} ;
    		
    		$("$piecestable@"+name).animation().to({
						dx : pos.x, 
						dy : pos.y,
					},100).start();
					
			//将相应着落点tag更新,
			game.changeTag([{key:0,data:[piecesPos[0],piecesPos[1]]},{key:1,data:[drop.x,drop.y]}]);
    	}
    }

});

$.addRemoteEventListener('piecesEvt', function(event){
	player.isYouOrder = false;
    var who = event.from.position ,
    	num = event.data.dropNum ,
    	deleteName = event.data.deleteName ,
    	moveName = event.data.moveName ,
    	type = event.data.dropType ;
    	
    if (who !== player.me().position ){
    	player.isYouOrder = true;
    	var drop = game.findByNum( num ,type );
    	
    	x = $("$piecestable@"+moveName).data().dx ,
    	y = $("$piecestable@"+moveName).data().dy ,
    	piecesPos = game.ensurePos( x ,y );
    	
    	if( !!drop ){
    		var pos = game._posXY( drop.x ,drop.y );
			
    		player.back.other.Arr[0] = $("$piecestable@"+moveName).data();
    		player.back.other.Arr[1] = $("$piecestable@"+deleteName).data();
    		player.back.other.pos = {x1: x , y1 :y } ;
    		
    		$("$piecestable@"+deleteName).remove();
    		$("$piecestable@"+moveName).animation().to({
						dx : pos.x , 
						dy : pos.y ,
					},100).start();
			
			//将相应着落点tag更新,
			game.changeTag([{key:0,data:[piecesPos[0],piecesPos[1]]}]);
    	}
    }

});

$.addRemoteEventListener('goback', function(event){
	player.isYouOrder = false;
    var who = event.from.position ,
    	my = player.back.my ,
    	other = player.back.other ;
     	
    if (who == player.me().position ){
    	player.isYouOrder = true;
    	
    	 var pos1 = game._posXY( my.pos.x1 ,my.pos.y1 ),
    		 pos2 = game._posXY( my.pos.x2 ,my.pos.y2 );
    		 
    	//将player.back.arr[0]移动到pos.x1,pos.y1
    	//若！！player.back.arr[1] && 将player.back.arr[1]显示在pos.x2,pos.y2
    	game.move( "$piecestable@"+ my.Arr[0].id , pos1.x ,pos1.y );
    	
    	//将相应着落点tag更新,
		game.changeTag([{key : 1 ,data:[ my.pos.x1, my.pos.y1 ]},
									{key : 0 ,data:[ my.pos.x2 ,my.pos.y2 ]}]);
		 
    	if( !!my.Arr[1]){
    		$.extend(my.Arr[1] ,{dx: pos2.x ,dy : pos2.y ,});
    		$( "$piecestable").entity( my.Arr[1].id ,my.Arr[1] ).draw();
    		
    		game.changeTag([{key:1,data:[my.pos.x2,my.pos.y2]}]);
    	}
    }else{
    	//var posO = game._posXY( player.back.other.Arr[0].dx ,player.back.other.Arr[0].dy );
    	if( !!other.Arr[0] ){
    		
    		game.move( "$piecestable@"+ other.Arr[0].id ,other.pos.x1,other.pos.y1);
    		
    		var pos01 = game._posXY(other.pos.x1,other.pos.y1,player.gap ,1 ) ,
    			pos02 = game._posXY(other.Arr[1].dx,other.Arr[1].dy,player.gap ,1 ) ;
    		game.changeTag([{key:1,data:[pos01.x ,pos01.y]},{key:0,data:[pos02.x ,pos02.y]}]);
    	}
    	if( !!other.Arr[1] ){
    		$( "$piecestable").entity( other.Arr[1].id ,other.Arr[1] ).draw();
    		
    		game.changeTag([{key:1,data:[pos02.x ,pos02.y]}]);
    	}
    }

});


