require.config({
    baseUrl: "js",
    paths: {
        'text': '../libs/text',
    },
    shim: {
    }
});

require(['app', 'app-main'], function(APP, appMain) {
    'use strict';

    var showAppMain = function() {
        appMain.show(document.getElementById('page-wrapper'));
    };

    window.setTimeout(showAppMain, 2000);

});