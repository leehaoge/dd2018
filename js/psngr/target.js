define(['text!html/psngr/target.html', 'core/fragment', 'app/dd-app'], function (tpl, Fragment, APP) {
    'use strict';

    var module;

    function moduleLoaded() {
        $('#btn-cancel').click(function() {
            APP.navigate('psngr-main');
        });
        $('#btn-ok').click(function() {
            var target = $('#ed-target').val();
            APP.navigate('psngr-main', {target: target});
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