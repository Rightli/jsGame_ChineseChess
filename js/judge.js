

var CheckerJudge = function(pos ){//pos{x1:,y1:,x2:,y2:}
	this.pos = pos ; 
	
};

//两个坐标点，棋子类型--判断步型 是否准确

CheckerJudge.prototype = {
	
	hasPieces : function( arr ){
		//判断塞眼--arr:要检查的坐标数组
		//坐标要求：是着落点坐标
		//检查对应坐标的着落点的tag值，为1---〉则返回false
		
		var myDropsObj = player.myDropsObj,
			otherDropsObj = player.otherDropsObj,num = 0;
			
		arr = arr || [] ;
		arr.forEach( function( value ,index ){
			
			// var key = value[0] + "_" + value[1] ,isTrue = false ;
			var key = value[0] + "_" + value[1] ;
			
			if( !!myDropsObj[key]&&myDropsObj[key].tag==1 ){
					//isTrue = true;
					num++;
			}else if( !!otherDropsObj[key]&&otherDropsObj[key].tag==1 ){
					//isTrue = true;
					num++;
			}else{
				//isTrue = false ;
			}
		} );
		
		return num ;
		
	},
	
	type : function( x ,y ){
		// player.myDropsObj
		if ( !!player.myDropsObj[x+"_"+y] ){
			return player.myDropsObj[x+"_"+y].type ;
		}
	},
	
	che : function(){
		var gap = player.gap ,message = 0 ,gapOne, //message=1--ok /=0----error
			x1 = this.pos.x1 ,x2 = this.pos.x2 ,y1 = this.pos.y1 ,y2 = this.pos.y2 ,t ,posXY=[],
			posArr = [y1-y2,x1-x2],index = null;
		//var hasPieces = this.hasPieces( [x2,y2] );
		
		x1 == x2?index = 0:(y1 == y2?index = 1:index = null);
		
		var len = Math.abs( posArr[index] )/gap; 
		len == gap ? gapOne = true : gapOne = false ; //第二个坐标点是否有棋子 ，且不是自己的棋子
		
		( posArr[index] && posArr[index] > 0 )?t = -1 : t=1 ;
		
		if(index!=null){
			
			for( var i = 1 ; i < len ;i++ ){
				//检查这条直线上着落点坐标数组
				posXY.push( [ x1 + gap*t*i*index  ,y1+ gap*t*i*((index+1)%2) ] );
			}
			var isCan = this.hasPieces( posXY );
			isCan==0 || gapOne?message = 1:message=0 ;
		}	
		return message;
		
	},
	
	ma : function(){
		var gap = player.gap ,message = 0; //message=1--ok /=0----error
		var x1 = this.pos.x1 ,x2 = this.pos.x2 ,y1 = this.pos.y1 ,y2 = this.pos.y2 ,posXY = [];
		var gapX = Math.abs( x1 - x2 ),
			gapY = Math.abs( y1 - y2 );
			
		if( gapX == gap && gapY == 2*gap ){
			( y1 - y2 ) >0?posXY[0] = [x1,y1-gap]:posXY[0] = [x1,y1+gap];
		}else if( gapX == 2*gap && gapY == gap ){
			( x1 - x2 ) >0?posXY[0] = [x1-gap,y1]:posXY[0] = [x1+gap,y1];
		}
		
		if ( posXY.length != 0 ){//若poxXY为空---〉不是日子步型
			var isCan = this.hasPieces( posXY );
			isCan==0?message = 1:message=0;
		}
		
		return message;
	},
	
	xiang : function(){
		//不能过界   this.type( x2,y2 )==1
		var gap = player.gap ,message = 0;
		var x1 = this.pos.x1 ,x2 = this.pos.x2 ,y1 = this.pos.y1 ,
			y2 = this.pos.y2 ,posXY = [] ,tx ,ty;
		var gapX = Math.abs( x1 - x2 ),
			gapY = Math.abs( y1 - y2 );
			
		if( this.type( x2,y2 ) && gapX == 2*gap && gapY == 2*gap ){
			( x1 - x2 )>0?tx = -1 : tx = 1;
			( y1 - y2 )>0?ty = -1 : ty = 1;
			posXY[0] = [ x1+gap*tx ,y1+gap*ty ];
			
		}
		
		if ( posXY.length != 0 ){//若poxXY为空---〉不是田子步型
			var isCan = this.hasPieces( posXY );
			isCan==0?message = 1:message=0;
		}
		
		return message;
	},
	
	shi : function(){
		var gap = player.gap ,message = 0; //message=1--ok /=0----error
		var x1 = this.pos.x1 ,x2 = this.pos.x2 ,y1 = this.pos.y1 ,
			y2 = this.pos.y2 ;
		var gapX = Math.abs( x1 - x2 ),
			gapY = Math.abs( y1 - y2 );
			
		if( gapX == gap && gapY == gap ){
			
			//限制坐标范围,在范围内----〉message = 1
			if ( x2 >= posConfig.myJSScope.minX && x2 <= posConfig.myJSScope.maxX &&
				y2 >=posConfig.myJSScope.minY && y2 <= posConfig.myJSScope.maxY ){
				
				message = 1;
			}else{
				message = 0;
			}
		}else{
			message = 0 ;
		}
		
		return message;
	},
	
	jiang : function(){
		var gap = player.gap ,message = 0; //message=1--ok /=0----error
		var x1 = this.pos.x1 ,x2 = this.pos.x2 ,y1 = this.pos.y1 ,
			y2 = this.pos.y2 ;
		var gapX = Math.abs( x1 - x2 ),
			gapY = Math.abs( y1 - y2 );
			
		if( ( gapX == gap && y1 == y2 )|| ( gapY == gap && x1 == x2 ) ){
			//限制坐标范围,在范围内----〉message = 1
			
			if ( x2 >= posConfig.myJSScope.minX && x2 <= posConfig.myJSScope.maxX &&
				y2 >=posConfig.myJSScope.minY && y2 <= posConfig.myJSScope.maxY ){
				
				message = 1;
			}else{
				message = 0;
			}
			
		}else{
			message = 0 ;
		}
		
		return message;
	},
	
	pao : function(){
		//只能隔着吃子，只能无阻的横竖行走
		
		var gap = player.gap ,message = 0, 
			x1 = this.pos.x1 ,x2 = this.pos.x2 ,y1 = this.pos.y1 ,y2 = this.pos.y2 ,t ,posXY=[],
			posArr = [y1-y2,x1-x2],index = null;
		var hasPieces = this.hasPieces( [[x2,y2]] ); //第二个坐标点是否有棋子
		
		x1 == x2?index = 0:(y1 == y2?index = 1:index = null);
		
		var len = Math.abs( posArr[index] )/gap; 
		( posArr[index] && posArr[index] > 0 )?t = -1 : t=1 ;
		
		if(index!=null){
			
			for( var i = 1 ; i < len ;i++ ){
				//检查这条直线上着落点坐标数组
				posXY.push( [ x1 + gap*t*i*index  ,y1+ gap*t*i*((index+1)%2) ] );
			}
			var isCan = this.hasPieces( posXY );
			if( isCan == 0 ){
				hasPieces==0?message = 1:message=0;
			}else if( isCan == 1 ){
				hasPieces==1?message = 1:message=0;
			}
			//( isCan==0 && hasPieces==0 )||(isCan==1 && hasPieces==1 )?message = 1:message=0;
		}	
		return message;
	}, 
	
	bing : function(){
		
		var gap = player.gap ,message = 0; //message=1--ok /=0----error
		var x1 = this.pos.x1 ,x2 = this.pos.x2 ,y1 = this.pos.y1 ,y2 = this.pos.y2 ;
		var gapX = Math.abs( x1 - x2 ),
			gapY = Math.abs( y1 - y2 );
			
		var myDropsObj = player.myDropsObj;//用于验证坐标点是否是玩家的
			
		if( ( y1 - y2 ) >=0 ){//只能前进
			
			if( !!myDropsObj[x2+"_"+y2 ] ){
				//在自家地盘;
				if( (gapY == gap) && (x1 == x2) ){
					message = 1;
				}
			}else{
				//在对家地盘;
				if((gapY == gap) && (x1 == x2)){
					message = 1;
				}else if((gapX == gap) && (y1 == y2)){
					message = 1;
				}
			}
			
		}
		return message;
	},
};


