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
			$errorClass = 'span.errorText',
			$minmax = 0;
			
        $.nonControl = function () {
			$firstValidate = 0;
			$($errorClass).remove();
            $($validateFrame).each(function () {
                $.nonScan(this, this.className);
            });
        };

        $.nonScan = function ($this, $class) {
            var $pattern = new RegExp('v\\[(.*)\\]','g'), 
				$array = $pattern.exec($class),
				$size,
				$sizePattern;
				
            if ($array != null) {
                if ($array.length > 0){
					$sizePattern = /^min\[|^max\[([0-9])\]$/g;
					$size = $sizePattern.exec($array[1]);
					if($size != null){
						if($size.length > 0){
							$minmax = parseInt($size[1]);
							$array[1] = $size[0].replace(/[^min|^max]/g,'');
						}
					};
					switch ($array[1]){
						case 'email':
							validations.email($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'required':
							validations.required($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'number':
							validations.number($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'letter':
							validations.letter($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'letterornumber':
							validations.letterornumber($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'decimal':
							validations.decimal($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'url':
							validations.url($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'dateTR':
							validations.dateTR($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'phoneTR':
							validations.phoneTR($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'min':
							validations.min($this.value) == false ? $.addValidateClass($this) : '';
						break;
						case 'max':
							validations.max($this.value) == false ? $.addValidateClass($this) : '';
						break;
					}
				}
            } else {
                console.log($($this).attr('type'));
            }
        };
		
		$.addValidateClass = function($this){
			$firstValidate++;
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
			},
			decimal : function(val){
				pattern = /^[\-\+]?(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/;  
	   			return pattern.test(val);
			},
			url : function(val){
				pattern = /(http|https|ftp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;  
	   			return pattern.test(val);
			},
			dateTR : function(val){
				pattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;  
	   			return pattern.test(val);
			},
			phoneTR : function(val){
				pattern = /0[\(|\s][0-9]{3}\)?[-\s\/][0-9]{3}[-\s\/][0-9]{2}[-\s\/][0-9]{2}/;  
	   			return pattern.test(val);
			},
			min : function(val){
				return val.length < $minmax ? false : true;	
			},
			max : function(val){
				return val.length > $minmax ? false : true;	
			}
		};
		
		//trigger pluging
		$.start();
    };
})(jQuery);