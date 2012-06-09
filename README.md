#HTML5 Number Input Polyfill

Formerly at https://github.com/wesleytodd/Form-FX/tree/master/polyfill

**Version 1.2**

This polyfill adds browser support for the HTML5 number input.  If using Modernizr, the plugin will only apply its functionality if browser support for the number input is not present.

The plugin uses the attributes `min`, `max` and `step` to build UI elements and their event handlers.

###Usage

The plugin will automatically call itself on all input's with a type of number.  If you wish to change the default options you can do as follows:

	<script>
	    $.html5NumberOptions = {
	        startInterval : 400,
	        $els          : $('#cart-form input')
	    }
	</script>
	<script src="jquery.html5-number.js"></script>

The options must be declared before the plugin file is loaded and you get an extra option `$els` which will override the jQuery collection the plugin gets called on.  This can be used if there are only certain number inputs you want to have the fallback functionality or if you want to disable the Modernizr browser check and always use the fallback.  You can do the later like this:

	<script>
	    $.html5NumberOptions = {
	        modernizr : false,
	        $els      : $('input.number')
	    }
	</script>
	<script src="html5-number.js"></script>

The reason you have to override the jQuery collection is because browsers that support the number type will add both sets of controls (plugin and browser).  So you have to use an input type of text so the supporting browsers do not add the standard controls.

You can also just turn the auto application by simply adding:

	<script>
	    $.html5NumberOptions = {
	        autoload : false
	    }
	</script>
	<script src="html5-number.js"></script>

This is let you just call the polyfill for any elements you want.

The full set of default options are as follows:

	$('input[type=number]').html5Number({
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
	});
