/**
 * @author Administrator
 */
Mind.fn.Entity.fn.extend({
	button : function( style ,fn ) {
		//this.data('text', text);
		this.data('style', style);
		this.data('fn', fn);
		this.shape(function() {
			
			var dx = this.data('dx'), 
				dy = this.data('dy'), 
				w = this.data('w'), 
				h = this.data('h'), 
				//text = this.data('text'), 
				style = this.data('style');
				
			//画矩形
			this.canvas().rect(dx,dy,dx+w,dy+h,style.rect);
			
			//画文字  ,对其方式（居中、左、右）
			var textName = style.text.name || 'button' ;
			this.canvas().text(dx+(w-textName.length*style.text.size)*0.5 ,dy+h*0.65,textName,style.text);
		});
		
		this.tap(function(){
			var fn = this.data('fn');
			fn();
		});
		
		return this;
	}
});
