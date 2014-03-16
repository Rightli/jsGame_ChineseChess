
//存放一些配置数据

var base = {};
base.baseW = 90;
base.baseH = 90;
var NormalPieces = {
	data : {
		"che" : {
			"black" : {
				color : 'black',
				piecesType : "che",
				sx : 0,
				sy : 0,
				sw : base.baseW,
				sh : base.baseH,
			},
			"red" : {
				color : 'red',
				piecesType : "che",
				sx : 0,
				sy : base.baseH*2,
				sw : base.baseW,
				sh : base.baseH,
			},
		},
		"jiang" : {
			"black" : {
				color : 'black',
				piecesType : "jiang",
				sx : base.baseW*1,
				sy : 0,
				sw : base.baseW,
				sh : base.baseH,
			},
			"red" : {
				color : 'red',
				piecesType : "jiang",
				sx : 0,
				sy : base.baseH*3,
				sw : base.baseW,
				sh : base.baseH,
			},
		},
		"ma" : {
			"black" : {
				color : 'black',
				piecesType : "ma",
				sx : base.baseW*2,
				sy : 0,
				sw : base.baseW,
				sh : base.baseH,
			},
			"red" : {
				color : 'red',
				piecesType : "ma",
				sx : base.baseW,
				sy : base.baseH*2,
				sw : base.baseW,
				sh : base.baseH,
			},
		},
		"xiang" : {
			"black" : {
				color : 'black',
				piecesType : "xiang",
				sx : base.baseW*3,
				sy : 0,
				sw : base.baseW,
				sh : base.baseH,
			},
			"red" : {
				color : 'red',
				piecesType : "xiang",
				sx : base.baseW,
				sy : base.baseH*3,
				sw : base.baseW,
				sh : base.baseH,
			},
		},
			
		"pao" : {
			"black" : {
				color : 'black',
				piecesType : "pao",
				sx : 0,
				sy : base.baseH*1,
				sw : base.baseW,
				sh : base.baseH,
			},
			"red" : {
				color : 'red',
				piecesType : "pao",
				sx : base.baseW*2,
				sy : base.baseH*2,
				sw : base.baseW,
				sh : base.baseH,
			},
		},
			
		"shi" : {
			"black" : {
				color : 'black',
				piecesType : "shi",
				sx : base.baseW*1,
				sy : base.baseH*1,
				sw : base.baseW,
				sh : base.baseH,
			},
			"red" : {
				color : 'red',
				piecesType : "shi",
				sx : base.baseW*3,
				sy : base.baseH*2,
				sw : base.baseW,
				sh : base.baseH,
			},
		}, 
			
		"bing" : {
			"black" : {
				color : 'black',
				piecesType : "bing",
				sx : base.baseW*2,
				sy : base.baseH*1,
				sw : base.baseW,
				sh : base.baseH,
			},
			"red" : {
				color : 'red',
				piecesType : "bing",
				sx : base.baseW*3,
				sy : base.baseH*1,
				sw : base.baseW,
				sh : base.baseH,
			},
		},
			
	},
	
	};
	

var Config = (function(){
	var instance ;
	function constructor(){
		 // var _h = window.innerHeight;
         // var _w = window.innerWidth;
       var _w =$.lc.width();//json字符串 《----》javascript对象
       var _h =$.lc.height();
	
    // containerOptions : {
    	// width : Config.width(),
    	// height : Config.height() ,
    // },
    // backImgOption : {
    	// width : Config.width() * 0.8 ,
    	// height : Config.height() * 0.8 ,
    // },
    // canvasOptions : {
    	// width : Config.width() * 0.8 ,
    	// height : Config.height() * 0.8 ,
    // },
    var _checkerBoardBase = { //棋盘配置数据
    	sx : 0 ,
		sy : 0 ,
		sw : 1280 ,
		sh : 720,
        dx : _w*0.05,//棋盘左上角起点坐标？
        dy : _w*0.25,
         // dx : 0,
         // dy : 0,
        line : 9,
        row : 8,
        gap : 60,
        // dw : _h,
        // dh : _w,
        //name "checker"+: ,
         //tag : 1,
    };
    
    var _piecesOptions = { //统一配置棋子参数
    	sx : 0 ,
		sy : 0 ,
		sw : 40 ,
		sh : 40,
		dw : 40 ,
		dh : 40 ,
		// N_Snum : 0 , //用于保存各个方向上的连续棋子数
		// E_Wnum : 0 ,
		// WS_ENnum : 0 ,
		// EN_WSnum : 0,
    };
    return {
            height: _h,
            width: _w,
            checkerBoardBase : _checkerBoardBase,
			piecesOptions : _piecesOptions
        };
	};
	return {
        getInstance: function(){
            if(!instance){
                instance = constructor();
            }
            // for(var key in instance){
                // if(instance.hasOwnProperty(key)){
                    // this[key] = instance[key] ;
                // }
            // }
            // this.getInstance = null;
            //return this;
            return instance;
        }
  };
    
    
})();
