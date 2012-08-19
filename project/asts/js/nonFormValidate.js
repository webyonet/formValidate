/*
 * nonFormValidate jQuery Plugin v1.0.0.0b
 * Licensed under the MIT license.
 * Copyright 2012 G.Burak Demirezen
 */
(function ($) {
    $.fn.nonFormValidate = function (options) {
        var defaults = {
			form : false,
            frame : null
        }, settings = $.extend(defaults, options);

        var $validate = "validate",
			$class = '.mValidate',
            $validateFrame = settings.frame +' '+ $class,
			$validatePattern = null;
            
			

        $.nonControl = function () {
            $($validateFrame).each(function () {
				//console.log(this.className);
                $.nonScan(this, this.className);
				//console.log(this);
            });
        };

        $.nonScan = function ($this, $class) {
            var $pattern = new RegExp('m\\[(.*)\\]','g'), 
				array = $pattern.exec($class);
			//console.log(array);
            if (array != null) {
                if (array.length > 0){
					$($this).addClass($validate);
					console.log(array[1]);
				}
            } else {
                console.log($($this).attr('type'));
            }
        };
		
		$.start = function(){
			if(!settings.form){
				if(settings.frame != null){
					$.nonControl();
				}
			}else{
				alert('true');	
			}
		};
		
		$('.' + $validate).live('focusout',function(){
			$(this).removeClass($validate);
		});
		
		var validations = {
			email : function(){
				pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
	   			return pattern.test(elementValue);
			}	
		};
		
		//trigger pluging
		$.start();
    };
})(jQuery);