/*
 * nonFormValidate jQuery Plugin v1.0.0.0b
 * Licensed under the MIT license.
 * Copyright 2012 G.Burak Demirezen
 */ (function ($) {
    $.fn.nonFormValidate = function (options) {
        var defaults = {
            form: false,
            frame: null,
            error: true,
			multierrortext : true ,
            errorText: {
                required: 'Bu Alan Boş Geçilemez',
                email: 'Hatalı Email Adresi',
                number: 'Bu Alana Yanlızca Sayı Girilebilir',
                letter: 'Bu Alana Yanlızca Metin Girilebilir',
                letterornumber: 'Bu Alana Yanlızca Metin ve Sayı Girilebilir',
                decimal: 'Bu Alana Yanlızca Sayı veya Rasyonel Sayı Girilebilir',
                url: 'Bu Alana Yanlızca Url Girilebilir',
                dateTR: 'Bu Alana Yanlızca Tarih Girilebilir "GG/AA/YYYY , GG-AA-YYYY"',
                phoneTR: 'Bu Alana Yanlızca Telefon Girilebilir "0(530) 000 00 00, 0(530) 000-00-00"',
                min: 'En Az {count} Karakter Olmalıdır',
                max: 'En Fazla {count} Karakter Olmalıdır',
            }
        }, settings = $.extend(defaults, options);

        var $validate = "validate",
            $class = '.nValidate',
            $dom = this,
            $validatePattern = null,
            $firstValidate = 0,
            $errorClass = 'span.error',
            $minmax = 0,
            $minMaxText = '';


        $.nonControl = function () {
            $firstValidate = 0;
            $($dom).children($errorClass).remove();
            $($dom).children($class).each(function () {
                $.nonScan(this, this.className);
            });
        };

        $.nonScan = function ($this, $class) {
            var $pattern = new RegExp('v\\[(.*)\\]', 'g'),
                $array = $pattern.exec($class),
                $size,
                $sizePattern,
                $multi = [];

            if ($array != null) {
                if ($array.length > 0) {
                    $multi = $array[1].split(' ');
                    for (i in $multi) {
                        $sizePattern = new RegExp('^[min\\[|max\\[]+([0-9]+)\\]$', 'g');
                        $size = $sizePattern.exec($multi[i]);
                        if ($size != null) {
                            if ($size.length > 0) {
                                $minmax = parseInt($size[1]);
                                $multi[i] = $size[0].replace(/[^min|^max]/g, '');
                            }
                        };
                        $.nonTrigger($this, $multi[i]);
                    } //for
                }
            } else {
                console.log($($this).attr('type'));
            }
        };

        $.nonTrigger = function ($this, $class) {
            $minMaxText = '';
            switch ($class) {
            case 'email':
                validations.email($this.value) == false ? $.addValidateClass($this, settings.errorText.email) : '';
                break;
            case 'required':
                validations.required($this.value) == false ? $.addValidateClass($this, settings.errorText.required) : '';
                break;
            case 'number':
                validations.number($this.value) == false ? $.addValidateClass($this, settings.errorText.number) : '';
                break;
            case 'letter':
                validations.letter($this.value) == false ? $.addValidateClass($this, settings.errorText.letter) : '';
                break;
            case 'letterornumber':
                validations.letterornumber($this.value) == false ? $.addValidateClass($this, settings.errorText.letterornumber) : '';
                break;
            case 'decimal':
                validations.decimal($this.value) == false || $this.value == '' ? $.addValidateClass($this, settings.errorText.decimal) : '';
                break;
            case 'url':
                validations.url($this.value) == false ? $.addValidateClass($this, settings.errorText.url) : '';
                break;
            case 'dateTR':
                validations.dateTR($this.value) == false ? $.addValidateClass($this, settings.errorText.dateTR) : '';
                break;
            case 'phoneTR':
                validations.phoneTR($this.value) == false ? $.addValidateClass($this, settings.errorText.phoneTR) : '';
                break;
            case 'min':
                $minMaxText = settings.errorText.min.replace(/\{count\}/g, $minmax);
                validations.min($this.value) == false ? $.addValidateClass($this, $minMaxText) : '';
                break;
            case 'max':
                $minMaxText = settings.errorText.max.replace(/\{count\}/g, $minmax);
                validations.max($this.value) == false ? $.addValidateClass($this, $minMaxText) : '';
                break;
            }
        };

        $.addValidateClass = function ($this, $text) {
            $firstValidate++;
            $($this).addClass($validate);
            if (settings.error){
				if($($this).next('span.error').length < 1) 
					$($this).after('<span class="error">' + $text + '</span>');
				else if(settings.multierrortext){
					$($this).next('span.error').append(document.createTextNode(' ' + $text));	
				}
			}
            if ($firstValidate == 1) {
                $('html,body').animate({
                    scrollTop: $($this).offset().top - 20
                }, 1000);
            }
        };

        $.start = function () {
            if (!settings.form) {
                if (settings.frame != null) {
                    $.nonControl();
                }
            } else {
                alert('true');
            }
        };

        $('.' + $validate).live('focusout', function () {
            $(this).removeClass($validate);
        });

        var validations = {
            required: function (val) {
                return val == '' ? false : true;
            },
            email: function (val) {
                pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                return pattern.test(val);
            },
            number: function (val) {
                pattern = /^[0-9]+$/;
                return pattern.test(val);
            },
            letter: function (val) {
                pattern = /^[a-zA-Z]+$/;
                return pattern.test(val);
            },
            letterornumber: function (val) {
                pattern = /^[0-9a-zA-Z]+$/;
                return pattern.test(val);
            },
            decimal: function (val) {
                pattern = /^[\-\+]?(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/;
                return pattern.test(val);
            },
            url: function (val) {
                pattern = /(http|https|ftp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
                return pattern.test(val);
            },
            dateTR: function (val) {
                pattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
                return pattern.test(val);
            },
            phoneTR: function (val) {
                pattern = /0[\(|\s][0-9]{3}\)?[-\s\/][0-9]{3}[-\s\/][0-9]{2}[-\s\/][0-9]{2}/;
                return pattern.test(val);
            },
            min: function (val) {
                return val.length < $minmax || val.length == 0 ? false : true;
            },
            max: function (val) {
                return val.length > $minmax || val.length == 0 ? false : true;
            }
        };

        //trigger pluging
        $.start();
        settings.frame = $dom;
    };
})(jQuery);