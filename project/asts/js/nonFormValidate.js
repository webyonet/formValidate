/*
 * nonFormValidate jQuery Plugin v1.1.0.0
 * Licensed under the MIT license.
 * Copyright 2012 G.Burak Demirezen
 */ 
(function ($) {
    $.fn.nonFormValidate = function (options) {
        var defaults = {
            form: false,
            error: true,
            multierrortext: true,
			focusout: false,
			keyup: true,
			change: true,
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
                equals: 'Şifreniz Birbiriyle Uyuşmuyor',
                checkbox: 'Bu Alanı İşaretlemek Zorunludur',
                radio: 'Bu Alanı işaretlemek Zorunludur radio',
                list: 'Bir Seçim Yapmalısınız'
            }
        }, settings = $.extend(defaults, options);
		
        var $validate = "validate",
            $class = '.nValidate',
            $dom = this,
            $validatePattern = null,
            $firstValidate = 0,
            $errorClass = 'span.error',
            $minmax = 0,
            $minMaxText = '',
            $password = '',
            $focusOut = false,
            $type,
            $choseControl = false,
            $choseGroup = '',
            $choseValidateGroup = false,
            $skip = 0,
            $choseValidateControl = true,
			$scrollControll = false,
        	$removeClassName = 'validate radio checkbox equals password max min phoneTR dateTR url decimal letterornumber letter number required email';

        $.nonControl = function () {
            $firstValidate = 0;
			$scrollControll = true;
            $($dom).children($errorClass).remove();
            $($dom).children($class).each(function () {
                $.nonScan(this, this.className);
            });
        };

        $.nonScan = function ($this, $class, $out) {
            if (typeof $out != 'undefined') $focusOut = true;
            $skip = 0;
            var $pattern = new RegExp('v\\[(.*)\\]', 'g'),
                $array = $pattern.exec($class),
                $size,
                $sizePattern,
                $multi = [];
            if ($array != null) {
                if ($array.length > 0) {
                    $multi = $array[1].split(' ');
                    for (i in $multi) {
                        $sizePattern = new RegExp('^[min\\[|max\\[|password\\[|equals\\[|checkbox\\[|radio\\[]+([0-9]+)\\]$', 'g');
                        $size = $sizePattern.exec($multi[i]);
                        if ($size != null) {
                            if ($size.length > 0) {
                                $minmax = parseInt($size[1]);
                                $multi[i] = $size[0].replace(/[^min|^max|^password|^equals|^checkbox|^radio]/g, '');
                            }
                        };
                        if ($multi[i] == 'checkbox' || $multi[i] == 'radio') {
                            if ($choseValidateGroup == false) {
                                if ($choseGroup != $.groupClear($this)) $.nonTrigger($this, $multi[i]);
                            } else {
                                $.chooseControl($this);
                                if ($choseGroup == $.groupClear($this)) {
                                    $.nonTrigger($this, $multi[i]);
                                }
                            }
                        } else {
                            $.nonTrigger($this, $multi[i]);
                        }
                    } //for
                    $choseValidateControl = true;
                }
            } else {
                console.error('insert "v[required]" type of validation Elements');
            }
        };

        $.addValidateClass = function ($this, $text, $types) {
            $firstValidate++;
            $skip++;
            $($this).addClass($validate);
            if (settings.error) {
                if ($types != 'checkbox' && $types != 'radio') {
                    if ($($this).next('span.error').length == 0) {
                        $($this).after('<span class="error ' + $types + '">' + $text + '</span>');
                    } else if (settings.multierrortext) {
                        if (!$focusOut) $($this).next('span.error').append(document.createTextNode(', ' + $text));
                        else $($this).next('span.error').text($text);
                    }
                } else {
                    if ($choseValidateControl) {
                        var $lastChose = $.choseLastError($this);
                        $($lastChose).after('<span class="error ' + $types + '">' + $text + '</span>');
                        $choseValidateControl = false;
                    }

                }
            }
            if ($firstValidate == 1 && $scrollControll == true) {
                $('html,body').animate({
                    scrollTop: $($this).offset().top - 20
                }, 1000);
            }
            $focusOut = false;
        };

        $.choseLastError = function (dom) {
            var $thisDom = $.groupClear(dom),
                $thisCounter = 0,
                $thisTemp = 0,
                $thisReturn = '';
            $($dom).children($class).each(function () {
                $type = $(this).attr('type');
                if ($type == 'checkbox' || $type == 'radio') {
                    if ($choseGroup == $.groupClear(this)) {
                        $thisCounter++;
                    }
                }
            });

            $($dom).children($class).each(function (i) {
                $type = $(this).attr('type');
                if ($type == 'checkbox' || $type == 'radio') {
                    if ($choseGroup == $.groupClear(this)) {
                        $thisTemp++;
                        if ($thisTemp == $thisCounter) {
                            $thisReturn = this;
                        }
                    }
                }
            });
            return $thisReturn;
        };

        $.chooseControl = function (dom) {
            $choseGroup = $.groupClear(dom);
            $choseControl = false;
            $($dom).children($class).each(function () {
                $type = $(this).attr('type');
                if ($type == 'checkbox' || $type == 'radio') {
                    if ($choseGroup == $.groupClear(this)) {
                        if ($(this).is(':checked') == true) {
                            $choseControl = true;
                        }
                    }
                }
            });
            return $choseControl;
        };
		
        $.start = function () {
            if (!settings.form) {
                if ($dom != null) {
                    $.nonControl();
                }
            } else {
                console.log('form true');
            }
        };
		
        $.groupClear = function (dom) {
            var pattern = /v\[.*\]/;
            return pattern.exec(dom.className).toString();
        };

        $.groupValidateClear = function (dom) {
            var $validateGroup = $.groupClear(dom);
            $($dom).children($class).each(function () {
                $type = $(this).attr('type');
                if ($type == 'checkbox' || $type == 'radio') {
                    if ($validateGroup == $.groupClear(this)) {
                        $(this).removeClass($removeClassName);
                        $(this).next('span.error').remove();
                    }
                }
            });
        };

        $.removeValidate = function (dom) {
            if ($skip == 0) $(dom).removeClass($removeClassName);
        };
		if(settings.change){
		$($class).live('change', function () {
			$scrollControll = false;
            $dom = $(this).closest('.nonFormValidate');
            if ($dom != null) {
                if ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio') {
                    $firstValidate = 0;
                    $choseValidateGroup = true;
                    $.nonScan(this, this.className);
                }
            }
            $choseValidateGroup = false;
        });
		}
		if(settings.focusout){
        $($class).live('focusout', function () {
			$scrollControll = false;
            $dom = $(this).closest('.nonFormValidate');
            if ($dom != null) {
                if ($(this).attr('type') != 'checkbox' && $(this).attr('type') != 'radio') {
                    $firstValidate = 0;
                    $.nonScan(this, this.className, true);
                    if (!$(this).hasClass('validate')) $(this).next('span.error').remove();
                }
            }
        });
		}
		if(settings.keyup){
		$($class).live('keyup', function () {
			$scrollControll = false;
            $dom = $(this).closest('.nonFormValidate');
            if ($dom != null) {
                if ($(this).attr('type') != 'checkbox' && $(this).attr('type') != 'radio') {
                    $firstValidate = 0;
                    $.nonScan(this, this.className, true);
                    if (!$(this).hasClass('validate')) $(this).next('span.error').remove();
                }
            }
        });
		}

        $.nonTrigger = function ($this, $class) {
            $minMaxText = '';
            switch ($class) {
            case 'email':
                validations.email($this.value) == false ? $.addValidateClass($this, settings.errorText.email, $class) : $.removeValidate($this);
                break;
            case 'required':
                validations.required($this.value) == false ? $.addValidateClass($this, settings.errorText.required, $class) : $.removeValidate($this);
                break;
            case 'number':
                validations.number($this.value) == false ? $.addValidateClass($this, settings.errorText.number, $class) : $.removeValidate($this);
                break;
            case 'letter':
                validations.letter($this.value) == false ? $.addValidateClass($this, settings.errorText.letter, $class) : $.removeValidate($this);
                break;
            case 'letterornumber':
                validations.letterornumber($this.value) == false ? $.addValidateClass($this, settings.errorText.letterornumber, $class) : $.removeValidate($this);
                break;
            case 'decimal':
                validations.decimal($this.value) == false || $this.value == '' ? $.addValidateClass($this, settings.errorText.decimal, $class) : $.removeValidate($this);
                break;
            case 'url':
                validations.url($this.value) == false ? $.addValidateClass($this, settings.errorText.url, $class) : $.removeValidate($this);
                break;
            case 'dateTR':
                validations.dateTR($this.value) == false ? $.addValidateClass($this, settings.errorText.dateTR, $class) : $.removeValidate($this);
                break;
            case 'phoneTR':
                validations.phoneTR($this.value) == false ? $.addValidateClass($this, settings.errorText.phoneTR, $class) : $.removeValidate($this);
                break;
            case 'min':
                $minMaxText = settings.errorText.min.replace(/\{count\}/g, $minmax);
                validations.min($this.value) == false ? $.addValidateClass($this, $minMaxText, $class) : $.removeValidate($this);
                break;
            case 'max':
                $minMaxText = settings.errorText.max.replace(/\{count\}/g, $minmax);
                validations.max($this.value) == false ? $.addValidateClass($this, $minMaxText, $class) : $.removeValidate($this);
                break;
            case 'password':
                $password = $this.value
                break;
            case 'equals':
                validations.equals($this.value) == false ? $.addValidateClass($this, settings.errorText.equals, $class) : $.removeValidate($this);
                break;
            case 'checkbox':
                if (validations.checkbox($this) == false) {
                    $.addValidateClass($this, settings.errorText.checkbox, $class);
                } else {
                    $.groupValidateClear($this);
                }
                break;
            case 'radio':
                if (validations.radio($this) == false) {
                    $.addValidateClass($this, settings.errorText.radio, $class);
                } else {
                    $.groupValidateClear($this);
                }
                break;
            }
        };

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
                pattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}$/;
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
            },
            equals: function (val) {
                return val != $password ? false : true;
            },
            checkbox: function (dom) {
                return $.chooseControl(dom);
            },
            radio: function (dom) {
                return $.chooseControl(dom);
            },
            list: function (dom) {

            }
        };
		
        //trigger pluging
        $.start();console.log('çalıştı');
		return $firstValidate == 0 ? true : false;
		
    };
})(jQuery);