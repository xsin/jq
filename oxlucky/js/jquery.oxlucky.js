/*!
  元素滚动插件
  @name jquery.oxlucky.js
  @author levinhuang (lv)
  @version 1.0
  @date 05/06/2013
  @copyright (c) 2012-2013 levinhuang (http://oxox.io,http://tencent.com,http://t.qq.com/badstyle)
  @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
*/
;(function($) {

	var $win = $(window);
	var model = function($d,opts) {
		this.$d = $d;
		this.opts = opts;
		this.timer = null;
		this.interval = this.opts.interval;
		this.curIdx = 0;
		this.prevIdx = -1;
		this.$prevItem = null;
		this.$curItem = null;
		this.init();
	};

	model.prototype = {
		showItem:function(idx){
			idx = idx<0?0:idx;
			idx = idx>(this.total-1)?0:idx;
			
			this.prevIdx = this.curIdx;
			this.curIdx = idx;

			var me = this;



			(this.$curItem && this.$curItem.removeClass(this.opts.clItemActive));

			this.$prevItem = this.$curItem;

			var cssSelector = '[data-luckysn="%"]'.replace('%',idx+'');

			this.$curItem = this.$items.filter(cssSelector).addClass(this.opts.clItemActive);

		},
		init:function () {

			this.$items = this.$d.find(this.opts.cssItem);

			//设置奖品的序号
			this.$items.each(function(i,o){
				if (!o.getAttribute('data-luckysn')) {
					o.setAttribute('data-luckysn',i);
				};
			});

			this.total = this.$items.length;
		},
		stop:function(idx){
			clearInterval(this.timer);
			if (typeof(idx)!=='undefined') {
				this.showItem(idx);
				this.reset();
			};
		},
		reset:function(){
			this.interval = this.opts.interval;
		},
		go:function(){
			this.stop();
			var me = this;

			this.interval = this.interval<this.opts.intervalMin?this.opts.intervalMin:this.interval;
			this.interval = this.interval>this.opts.intervalMax?this.opts.intervalMax:this.interval;

			this.timer = setTimeout(function(){
				me.showItem(me.curIdx+1);
				me.interval+=me.opts.intervalStep;

				me.go();

			},this.interval);
		},
		update:function(opts,reInit){
			this.opts = opts;
			if(reInit){
				this.init();
			}
		}//updateOpts
	};

	$.fn.oxlucky = function(opts) {
		// Set the options.
		var optsType = typeof(opts),
			opts1 = optsType!=='string'?$.extend(true,{}, $.fn.oxlucky.defaults, opts||{}):$.fn.oxlucky.defaults,
			args = arguments;
		
		// Go through the matched elements and return the jQuery object.
		return this.each(function () {
			var $me = $(this),
				instance = $me.data("oxlucky");
			if(instance) {

				if(instance[opts]){
					
					instance[opts].apply(instance,Array.prototype.slice.call(args, 1));

				}else if (typeof(opts) === 'object' || !opts){
					
					instance.update.apply(instance,args);

				}else{
					console&&console.log('Method '+opts+' does not exist in jQuery.oxlucky');
				}

			}else {
				$me.data("oxlucky",new model($me, opts1));
			}
		});
	};

	$.fn.oxlucky.defaults = {
		cssItem:'.luckyitem',
		clItemActive:'luckyitem_on',
		intervalMin:40,					// 最小的时间间隔
		intervalMax:1000,				// 最大的时间间隔
		interval:50,					// 滚动的时间间隔
		intervalStep:20				// 每次滚动后增加的时间步长。通过step控制越转越快或越转越慢
	};

})(jQuery);