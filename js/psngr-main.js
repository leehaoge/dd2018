define(['text!html/main.html', 'core/fragment', 'app/dd-app'], function(tpl, Fragment, APP) {
    'use strict';

    var conf, module;

    function moduleLoaded() {
        var $start = $('#el-where-start'),
            $target = $('#el-where-target'),
            hasStart = false, hasTarget = false;
        if (conf.start) {
            hasStart = true;
            $start.html(conf.start);
        } else {
            $start.html('<a href="#" id="ln-where-start">你在哪上车</a>');
        }
        if (conf.target) {
            hasTarget = true;
            $target.html(conf.target);
        } else {
            $target.html('<a href="#" id="ln-where-target">你要去哪儿</a>');
        }

        if (!hasStart || !hasTarget) {
            $('#div-trip-price').addClass('hidden');
            $('#div-trip-control').addClass('hidden');
        } else {
            $('#el-trip-price').html('10.5');
            $('#div-trip-price').removeClass('hidden');
            $('#div-trip-control').removeClass('hidden');
        }

        $('#ln-where-start').click(function() {
            APP.navigate('where-start');
        });
        $('#ln-where-target').click(function() {
            APP.navigate('where-target');
        });
    }

    module = {
        show: function(el, config) {
            var fragment = new Fragment(el);
            conf = conf || {};
            conf = $.extend(conf, config);
            fragment.load(tpl, conf, moduleLoaded);
        }
    }

    return module;

});