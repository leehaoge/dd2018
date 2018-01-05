require.config({
    baseUrl: "js",
    paths: {
        'text': '../libs/text',
    },
    shim: {
    }
});

require(['app/dd-app', 'routes'], function(APP, routes) {
    'use strict';

    APP.navigate = routes.navigate;

    var showAppMain = function() {
        APP.navigate('main');
    };

    window.setTimeout(showAppMain, 2000);

});