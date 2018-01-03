define(['text!html/main.html', 'core/fragment', 'app'], function(tpl, Fragment, APP) {
    'use strict';

    var module;

    function moduleLoaded() {
        $('#ln-where-start').click(function() {
            APP.navigate('where-start');
        });
    }

    module = {
        show: function(el, config) {
            var fragment = new Fragment(el);
            fragment.load(tpl, config, moduleLoaded);
        }
    }

    return module;

});