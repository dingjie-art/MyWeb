/*!
 *  Echo v1.4.0
 *  Lazy-loading with data-* attributes, offsets and throttle options
 *  
 *  by huangxiao
 *  description 图片懒加载
 */
window.Echo = (function(window, document, undefined) {

	'use strict';

	var store = [],
	target,
	offset,
	throttle,
	poll;

	var _inView = function(el) {
		var coords = el.getBoundingClientRect();
		var staff = (coords.top >= 0 && coords.left >= 0 && coords.left) < document.documentElement.clientWidth
		return staff
	};

	var _pollImages = function() {
		for (var i = store.length; i--;) {
			var self = store[i];
			if (_inView(self)) {
				if(target === 'img'){
					self.src = self.getAttribute('data-echo');
					store.splice(i, 1);
				}else{
					var num = i;
					var oImg = document.createElement("img");
					oImg.src = self.getAttribute('data-echo');
					oImg.onload = function(){
						var url = store[num].getAttribute('data-echo');
						$(store[num]).find(".imgLoad").remove();
						store[num].style.backgroundImage = 'url('+url+')';
						store.splice(num, 1);
					}
				}
			}
		}
	};

	var _throttle = function() {
		clearTimeout(poll);
		poll = setTimeout(_pollImages, throttle);
	};

	var init = function(obj) {
		var nodes = document.querySelectorAll('[data-echo]');
		
		//<img src="${ctx }${frontTemplateDir }/js/extend/lazyload/index.double-ring-spinner.svg"/>
		for(var i=0; i<nodes.length; i++){
			$(nodes[i]).append('<img class="imgLoad" src="/template/shejizhou/js/extend/lazyload/index.double-ring-spinner.svg" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);"/>');
		}
		
		var opts = obj || {};
		offset = opts.offset || 0;
		throttle = opts.throttle || 250;
		target = opts.target || 'img'

		for (var i = 0; i < nodes.length; i++) {
			store.push(nodes[i]);
		}

		_throttle();
		
		//给页面绑定滑轮滚动事件
	    if (document.addEventListener) {
	        document.addEventListener('DOMMouseScroll', _throttle, false);
	    }
	    //滚动滑轮触发scrollFunc方法
	    window.onmousewheel = document.onmousewheel = _throttle;
		  
		
	};

	return {
		init: init,
		render: _throttle
	};

})(window, document);