define(['text!html/main.html', 'core/fragment'], function(tpl, Fragment) {
    'use strict';

    var module;

    function moduleLoaded() {

    }

    module = {
        show: function(el, config) {
            var fragment = new Fragment(el);
            fragment.load(tpl, config, moduleLoaded);
        }
    }

    return module;

});