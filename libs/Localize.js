/**
 * @author blife
 * @email blife450@gmail.com
 *
 * This code is written on the knee. Do not judge strictly. And better not climb here.
 *
 * Copyright 2016-2019 Blife Authors
 * https://custom-cursor.com
 */
class Localize{init(){$("[data-i18n]").each(function (element){let message=chrome.i18n.getMessage($(this).attr('data-i18n'));$(this).html(message)})}}
/*
class Localize {
    init() {
        $("[data-i18n]").each(function(element) {
            let message = chrome.i18n.getMessage($(this).attr('data-i18n'));
            $(this).html(message)
        })
    }
}
*/