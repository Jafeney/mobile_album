/*
* 移动相册的单例模式
*/

var IndexModule={
	total:17,
	zWin:$(window),
	cid:null,
	wImage:$('#large_img'),
	lock:false,
	domImage:$('#large_img')[0],
	render:function(){
		var self=this;
		var tmpl = '';
		var padding = 2;
		var scrollBarWidth = 0;
		var winWidth = $(window).width();
		var picWidth = Math.floor((winWidth-padding*3-scrollBarWidth)/4);
		for(var i=1;i<=self.total;i++){
			var p = padding;
			if(i%4==1){
				p = 0;
			}
			tmpl+='<li data-id="'+i+'" class="animated bounceIn" style="width:'+picWidth+'px;height:'+picWidth+'px;padding-left:'+p+'px;padding-top:'+padding+'px;"><img src="img/'+i+'.jpg"></li>';
		}
		$('#container').html(tmpl);
	},
	loadImg:function(id,callback){
		var self=this;
		$('#container').css({height:self.zWin.height(),'overflow':'hidden'});
		$('#large_container').css({
			width:self.zWin.width(),
			height:self.zWin.height()
			//top:$(window).scrollTop()
		}).show();
		var imgsrc = './img/'+id+'.large.jpg';
		var ImageObj = new Image();
		ImageObj.src = imgsrc;
		ImageObj.onload = function(){
			var w = this.width;
			var h = this.height;
			var winWidth = self.zWin.width();
			var winHeight = self.zWin.height();
		    var realw = parseInt((winWidth - winHeight*w/h)/2);
			var realh = parseInt((winHeight - winWidth*h/w)/2);

			self.wImage.css('width','auto').css('height','auto');
			self.wImage.css('padding-left','0px').css('padding-top','0px');
			if(h/w>1.2){
				 self.wImage.attr('src',imgsrc).css('height',winHeight).css('padding-left',realw+'px');
			}else{	
				 self.wImage.attr('src',imgsrc).css('width',winWidth).css('padding-top',realh+'px');
			}
			callback&&callback();
		};
	},
	eventBind:function(){
		var self=this;
		$('#container').delegate('li','tap',function(){
			var _id = self.cid = $(this).attr('data-id');
			self.loadImg(_id);
		});

		$('#large_container').tap(function(){
			$('#container').css({height:'auto','overflow':'auto'});
			$('#large_container').hide();
		});

		$('#large_container').mousedown(function(e){
			e.preventDefault();
		});

		$('#large_container').swipeLeft(function(){
			if(self.lock){
				return;
			}
			self.cid++;
			
			self.lock =true;
			self.loadImg(self.cid,function(){
				self.domImage.addEventListener('webkitAnimationEnd',function(){
					self.wImage.removeClass('animated bounceInRight');
					self.domImage.removeEventListener('webkitAnimationEnd');
					self.lock = false;
				},false);
				self.wImage.addClass('animated bounceInRight');
			});
		});

		$('#large_container').swipeRight(function(){
			if(self.lock){
				return;
			}
			self.cid--;
			self.lock =true;
			if(self.cid>0){
				self.loadImg(self.cid,function(){
					self.domImage.addEventListener('webkitAnimationEnd',function(){
						self.wImage.removeClass('animated bounceInLeft');
						self.domImage.removeEventListener('webkitAnimationEnd');
						self.lock = false;
					},false);
					self.wImage.addClass('animated bounceInLeft');
				});
			}else{
				self.cid = 1;
			}
		});
	},
	init:function(){
		var self=this;
		self.render();
		self.eventBind();
	}
};

IndexModule.init();