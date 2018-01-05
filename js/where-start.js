define(['text!html/start.html', 'core/fragment', 'app/dd-app'], function (tpl, Fragment, APP) {
    'use strict';

    var module;

    function moduleLoaded() {
        $('#btn-cancel').click(function() {
            APP.navigate('main');
        });
        $('#btn-ok').click(function() {
            var start = $('#ed-start').val();
            APP.navigate('main', {start: start});
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