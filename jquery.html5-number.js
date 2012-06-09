/*
 * HTML5 Number Input Polyfill
 * http://wesleytodd.com/
 * http://wlion.com
 * 
 * Version 1.2
 * 
 * Requires     jQuery
 * 
 * Basic Usage:
 * $('input[type=number]').html5Number({
		modernizr : (function(){                               //Set to false to use the fallback always
			if(typeof Modernizr != 'undefined'){
				return true;
			}else{
				return false;
			}
		})(),
		plusButton    : $('<a href="#" class="plus">+</a>'),
		minusButton   : $('<a href="#" class="minus">-</a>'),
		defaultVal    : 0,
		startInterval : 200,
		accelleration : 1.1
	});
 */
(function($){
	$.html5Number = function(el, options){
		var base = this;
		base.$el = $(el);
		base.el = el;
		base.$el.data('html5Number', base);
		base.min = -9999999;
		base.max = 9999999;
		base.step = 1;
		
		base.init = function(){
			base.options = $.extend({}, $.html5Number.defaultOptions, options);
			if(base.options.modernizr && Modernizr.inputtypes.number)
				return false;
			
			base.$el.on('updatemethods.html5Number', function(){
				base.registerMethods();
			});
			base.$el.trigger('updatemethods.html5Number');
			
			if(typeof base.$el.attr('min') != 'undefined'){
				base.min = parseInt(base.$el.attr('min'));
			}
			if(typeof base.$el.attr('max') != 'undefined'){
				base.max = parseInt(base.$el.attr('max'));
			}
			if(typeof base.$el.attr('step') != 'undefined'){
				base.step = parseInt(base.$el.attr('step'));
			}
			
			if(typeof base.options.plusButton == 'function'){
				base.options.plusButton = base.options.plusButton.call(base);
			}
			if(typeof base.options.minusButton == 'function'){
				base.options.minusButton = base.options.minusButton.call(base);
			}
			
			base.options.plusButton = base.options.plusButton.clone();
			base.options.minusButton = base.options.minusButton.clone();
			
			base.controls = $('<div class="html5Number-controls"></div>').append(base.options.plusButton).append(base.options.minusButton);
			
			base.controls.on({
				'click.html5Number' : function(e){
					if($(e.target).is(base.options.plusButton)){
						base.increment();
					}else if($(e.target).is(base.options.minusButton)){
						base.decrement();
					}
					e.preventDefault();
				},
				'mousedown.html5Number' : function(e){
					if($(e.target).is(base.options.plusButton)){
						var fnc = base.increment;
					}else if($(e.target).is(base.options.minusButton)){
						var fnc = base.decrement;
					}
					base.rateLimit(fnc, base.options.startInterval);
					e.preventDefault();
				}
			});
			$('html').on('mouseup', function(){
				if(typeof base.timeout != 'undefined'){
					clearTimeout(base.timeout);
				}
			});
			base.$el.wrap('<div class="html5Number-wrap" />').after(base.controls);
		};
		
		base.rateLimit = function(fnc, t){
			base.timeout = setTimeout(function(){
				fnc.call(base);
				base.rateLimit(fnc, t/base.options.accelleration);
			}, t);
		}
		
		base.registerMethods = function(){
			$.each($.html5Number.publicMethods, function(i, v){
				if(!base[i]){
					base[i] = v;
				}
			});
		}
		base.init();
	};
	
	$.html5Number.publicMethods = {
		addMethod : function(name, method){
			$.html5Number.publicMethods[name] = method;
			this.$el.trigger('updatemethods.html5Number');
			return this.$el;
		},
		increment : function(){
			v = parseInt(this.$el.val());
			if(isNaN(v)){
				v = this.options.defaultVal;
			}
			nv = v + this.step;
			if(nv > this.max){
				nv = this.max;
				this.$el.trigger('maxReached');
			}
			this.$el.val(nv).change();
			return this.$el;
		},
		decrement : function(){
			v = parseInt(this.$el.val());
			if(isNaN(v)){
				v = this.options.defaultVal;
			}
			nv = v - this.step;
			if(nv < this.min){
				nv = this.min;
				this.$el.trigger('minReached');
			}
			this.$el.val(nv).change();
			return this.$el;
		}
	}
	$.html5Number.defaultOptions = {
		modernizr : (function(){
			if(typeof Modernizr != 'undefined'){
				return true;
			}else{
				return false;
			}
		})(),
		plusButton    : $('<a href="#" class="plus">+</a>'),
		minusButton   : $('<a href="#" class="minus">-</a>'),
		defaultVal    : 0,
		startInterval : 200,
		accelleration : 1.1
	};
	$.fn.html5Number = function(method){
		if(typeof method === 'string' && $.html5Number.publicMethods[method] ){
			return $.html5Number.publicMethods[method].apply(this.data('html5Number'), Array.prototype.slice.call( arguments, 1 ));
		}else if(typeof method === 'object' || !method){
			return this.each(function(){
				(new $.html5Number(this, method));
			});
		} else {
			$.error( 'Method ' +  method + ' does not exist.' );
		}
	};
	if(typeof $.html5NumberOptions != 'undefined' && typeof $.html5NumberOptions.$els != 'undefined'){
		$.html5NumberOptions.$els.html5Number($.html5NumberOptions);
	}else if(typeof $.html5NumberOptions == 'undefined' || (typeof $.html5NumberOptions == 'undefined' && $.html5NumberOptions.autoload != false )){
		$('input[type=number]').html5Number();
	}
})(jQuery);