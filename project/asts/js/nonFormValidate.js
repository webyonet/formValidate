/*
 * nonFormValidate jQuery Plugin v1.0.0.0b
 * Licensed under the MIT license.
 * Copyright 2012 G.Burak Demirezen
 */
(function ($) {
    $.fn.nonFormValidate = function (options) {
        var defaults = {
			form : false,
            frame : null,
			errorText : true
        }, settings = $.extend(defaults, options);

        var $validate = "validate",
			$class = '.nValidate',
            $validateFrame = settings.frame +' '+ $class,
			$validatePattern = null,
			$firstValidate = 0,
			$errorClass = 'span.errorText';

        $.nonControl = function () {
			$($errorClass).remove();
            $($validateFrame).each(function () {
                $.nonScan(this, this.className);
            });
        };

        $.nonScan = function ($this, $class) {
            var $pattern = new RegExp('v\\[(.*)\\]','g'), 
				array = $pattern.exec($class);
            if (array != null) {
                if (array.length > 0){
					switch (array[1]){
						case 'email':
							$firstValidate++;
							validations.email($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'required':
							$firstValidate++;
							validations.required($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'number':
							$firstValidate++;
							validations.number($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'letter':
							$firstValidate++;
							validations.letter($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'letterornumber':
							$firstValidate++;
							validations.letterornumber($this.value) == false ? $.addValidateClass($this) : '';
						break;
					}
				}
            } else {
                console.log($($this).attr('type'));
            }
        };
		//console.log(validations.email($this.value));
						//console.log(array[1]);
		$.addValidateClass = function($this){
			$($this).addClass($validate);
			if(settings.errorText)
				$.errorTextAdd($this);
			if($firstValidate == 1){
				$('html,body').animate({
					scrollTop: $($this).offset().top - 20
				}, 1000);
			}
		};
		
		$.errorTextAdd = function($this){
			$($this).after('<span class="errorText">Dikkat</span>');	
		}
		
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
			required : function(val){
				return val == '' ? false : true;
			},
			email : function(val){
				pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
	   			return pattern.test(val);
			},
			number : function(val){
				pattern = /^[0-9]+$/;  
	   			return pattern.test(val);
			},
			letter : function(val){
				pattern = /^[a-zA-Z]+$/;  
	   			return pattern.test(val);
			},
			letterornumber : function(val){
				pattern = /^[0-9a-zA-Z]+$/;  
	   			return pattern.test(val);
			}	
		};
		
		//trigger pluging
		$.start();
    };
})(jQuery);