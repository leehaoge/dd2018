define(['text!html/start.html', 'core/fragment', 'app'], function (tpl, Fragment, APP) {
    'use strict';

    var module;

    function moduleLoaded() {
        $('.page-img>img').click(function () {
            var $this = $(this),
                imgWidth = this.clientWidth,
                imgHeight = this.clientHeight,
                e = window.event,
                scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
                scrollY = document.documentElement.scrollTop || document.body.scrollTop,
                x = e.pageX || e.clientX + scrollX,
                y = e.pageY || e.clientY + scrollY,
                pt = { 'x': x, 'y': y };
            if (y > (imgHeight * 18 / 590) && y < (imgHeight * 41 / 590) &&
                x > (imgWidth * 320 / 375) && x < (imgWidth * 372 / 375)) {
                APP.navigate('main');
            }
            if (y > (imgHeight * 542 / 590) && y < (imgHeight * 570 / 590) &&
                x > (imgWidth * 309 / 375) && x < (imgWidth * 372 / 375)) {
                APP.navigate('main', {'start': 'a location'});
            }
        });
    }

    module = {
        show: function (el, config) {
            var fragment = new Fragment(el);
            fragment.load(tpl, config, moduleLoaded);
        }
    }

    return module;

});