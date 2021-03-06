/*
 * nonFormValidate jQuery Plugin v1.7.5.1
 * Licensed under the MIT license.
 * Copyright 2012 G.Burak Demirezen
 */ 
(function ($) {
    $.fn.nonFormValidate = function (options) {
        var defaults = {
            form: false,
            error: true,
            multierrortext: true,
            scroll: true,
			focusout: false,
            keyup: true,
            change: true,
			textchange: false
        }, messages,
        errorText = {
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
            password: 'Hatalı Şifre',
            equals: 'Şifreniz Birbiriyle Uyuşmuyor',
            checkbox: 'En Az Bir Seçim Yapmalısınız',
            radio: 'Bir Seçim Yapmalısınız',
            list: 'Bir Seçim Yapmalısınız',
            multilist: 'En Az {count} Seçim Yapmalısınız',
            agree: 'Sözleşmeyi Kabul Etmelisin'
        }, settings = $.extend(defaults, options);

        if (typeof options != 'undefined') {
            messages = $.extend(errorText, options.messages);
        };

        /*
			public variables
		*/
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
            $multilist = 0,
            $choseValidateControl = true,
            $scrollControll = false;

        /*
			nValidate class search 
		*/
        $.nonControl = function () {
            $firstValidate = 0;
            $scrollControll = true;
            $($dom).find($errorClass).remove();
            $($dom).find($class).each(function () {
                $.nonScan(this, this.className);
            });
        };
        /*
			validate scan function
		*/
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
                        $sizePattern = new RegExp('^[min\\[|max\\[|password\\[|equals\\[|checkbox\\[|radio\\[|multilist\\[]+([0-9]+)\\]$', 'g');
                        $size = $sizePattern.exec($multi[i]);
                        if ($size != null) {
                            if ($size.length > 0) {
                                $minmax = parseInt($size[1]);
                                $multi[i] = $size[0].replace(/[^min|^max|^password|^equals|^checkbox|^radio|^multilist]/g, '');
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
        /*
			add to validate class
		*/
        $.addValidateClass = function ($this, $text, $types) {
            if ($.browser.msie) {
                if ($($this).attr('type') == 'password') {
                    if (typeof $.watermark === 'object') $($this).prev('span.error').remove();
                }
            }
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
                        $($lastChose).after('<span class="error ' + $types + ' group' + $minmax + '">' + $text + '</span>');
                        $choseValidateControl = false;
                    }

                }
            }
            if (settings.scroll) {
                if ($firstValidate == 1 && $scrollControll == true) {
                    $('html,body').animate({
                        scrollTop: $($this).offset().top - 20
                    }, 1000);
                }
            }
            $focusOut = false;
        };
        /*
			checkbox and radio group for last element search
		*/
        $.choseLastError = function (dom) {
            var $thisDom = $.groupClear(dom),
                $thisCounter = 0,
                $thisTemp = 0,
                $thisReturn = '';
            $($dom).find($class).each(function () {
                $type = $(this).attr('type');
                if ($type == 'checkbox' || $type == 'radio') {
                    if ($choseGroup == $.groupClear(this)) {
                        $thisCounter++;
                    }
                }
            });

            $($dom).find($class).each(function (i) {
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
        /*
			checkbox group check
		*/
        $.chooseControl = function (dom) {
            $choseGroup = $.groupClear(dom);
            $choseControl = false;
            $($dom).find($class).each(function () {
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
        /*
			control to multible seclect option
		*/
        $.multiListControl = function (dom) {
            $multilist = 0;
            $(dom).children('option:selected').each(function () {
                $multilist++;
            });
            return $multilist;
        };
        /*
			start validation
		*/
        $.start = function () {
            if (!settings.form) {
                if ($dom != null && $dom.length != 0) {
                    $.nonControl();
                }
            } else {
                console.log('form true');
            }
        };
        /*
			array syntax clear
		*/
        $.groupClear = function (dom) {
            var pattern = /v\[.*\]/;
            return pattern.exec(dom.className).toString();
        };
        /*
			checkbox and radio clear class validate and remove error element
		*/
        $.groupValidateClear = function (dom) {
            var $validateGroup = $.groupClear(dom);
            $($dom).find($class).each(function () {
                $type = $(this).attr('type');
                if ($type == 'checkbox' || $type == 'radio') {
                    if ($validateGroup == $.groupClear(this)) {
                        $(this).removeClass($validate);
                        $(this).next('span.error').remove();
                    }
                }
            });
        };
        /*
			clear class validate
		*/
        $.removeValidate = function (dom) {
            if ($skip == 0) $(dom).removeClass($validate);
        };

        $.clearValidate = function () {
            if ($('.validate').length > 0) {
                $('span.error').remove();
                $('.validate').removeClass('validate');
            }
        };
        //$($class).die('keyup');

        if (settings.change) {
            $(document).off('change', $class);
            $(document).on('change', $class, function () {
                $scrollControll = false;
                $dom = $(this).closest('.nonFormValidate');
                if ($dom != null) {
                    if ($(this).attr('type') == 'checkbox' || $(this).attr('type') == 'radio' || $(this).is('select')) {
                        $firstValidate = 0;
                        $choseValidateGroup = true;
                        $.nonScan(this, this.className, true);
                    }
                }
                $choseValidateGroup = false;
            });
        };

        if (settings.focusout) {
            $(document).off('focusout', $class);
            $(document).on('focusout', $class, function () {
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
        };

        if (settings.keyup) {
            $(document).off('keyup', $class);
            $(document).on('keyup', $class,function () {
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
        };
		
		 if (settings.textchange) {
            $($class+':text').off('change');
            $($class+':text').on('change', function () {
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
        };
		
        /*
			trigger validate
		*/
        $.nonTrigger = function ($this, $class) {
            $minMaxText = '';
            switch ($class) {
            case 'email':
                validations.email($($this).val()) == false ? $.addValidateClass($this, errorText.email, $class) : $.removeValidate($this);
                break;
            case 'required':

                validations.required($($this).val()) == false ? $.addValidateClass($this, errorText.required, $class) : $.removeValidate($this);
                break;
            case 'number':
                validations.number($($this).val()) == false ? $.addValidateClass($this, errorText.number, $class) : $.removeValidate($this);
                break;
            case 'letter':
                validations.letter($($this).val()) == false ? $.addValidateClass($this, errorText.letter, $class) : $.removeValidate($this);
                break;
            case 'letterornumber':
                validations.letterornumber($($this).val()) == false ? $.addValidateClass($this, errorText.letterornumber, $class) : $.removeValidate($this);
                break;
            case 'decimal':
                validations.decimal($($this).val()) == false || $($this).val() == '' ? $.addValidateClass($this, errorText.decimal, $class) : $.removeValidate($this);
                break;
            case 'url':
                validations.url($($this).val()) == false ? $.addValidateClass($this, errorText.url, $class) : $.removeValidate($this);
                break;
            case 'dateTR':
                validations.dateTR($($this).val()) == false ? $.addValidateClass($this, errorText.dateTR, $class) : $.removeValidate($this);
                break;
            case 'phoneTR':
                validations.phoneTR($($this).val()) == false ? $.addValidateClass($this, errorText.phoneTR, $class) : $.removeValidate($this);
                break;
            case 'min':
                $minMaxText = errorText.min.replace(/\{count\}/g, $minmax);
                validations.min($($this).val()) == false ? $.addValidateClass($this, $minMaxText, $class) : $.removeValidate($this);
                break;
            case 'max':
                $minMaxText = errorText.max.replace(/\{count\}/g, $minmax);
                validations.max($($this).val()) == false ? $.addValidateClass($this, $minMaxText, $class) : $.removeValidate($this);
                break;
            case 'password':
                $password = $($this).val();
                validations.password($($this).val()) == false ? $.addValidateClass($this, errorText.password, $class) : $.removeValidate($this);
                break;
            case 'equals':
                validations.equals($($this).val()) == false ? $.addValidateClass($this, errorText.equals, $class) : $.removeValidate($this);
                break;
            case 'checkbox':
                if (validations.checkbox($this) == false) {
                    $.addValidateClass($this, errorText.checkbox, $class);
                } else {
                    $.groupValidateClear($this);
                }
                break;
            case 'radio':
                if (validations.radio($this) == false) {
                    $.addValidateClass($this, errorText.radio, $class);
                } else {
                    $.groupValidateClear($this);
                }
                break;
            case 'list':
                $($this).next($errorClass).remove();
                validations.list($this) == false ? $.addValidateClass($this, errorText.list, $class) : $.removeValidate($this);
                break;
            case 'multilist':
                $minMaxText = errorText.multilist.replace(/\{count\}/g, $minmax);
                validations.multilist($this) == false ? $.addValidateClass($this, $minMaxText, $class) : $.removeValidate($this);
                break;
            case 'agree':
                $($this).next($errorClass).remove();
                validations.agree($this) == false ? $.addValidateClass($this, errorText.agree, $class) : $.removeValidate($this);
                break;
            }
        };
        /*
			validation control as object
		*/
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
            password: function (val) {
                return val == '' ? false : true;
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
                return $(dom).children('option:selected').val() == '' ? false : true;
            },
            multilist: function (dom) {
                return $.multiListControl(dom) < $minmax ? false : true;
            },
            agree: function (dom) {
                return $(dom).is(':checked') == false ? false : true;
            }
        };

        //trigger pluging
        $.start();
        return $firstValidate == 0 ? true : false;
    };
})(jQuery);