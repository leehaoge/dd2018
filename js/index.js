require.config({
    baseUrl: "js",
    paths: {
        'text': '../libs/text',
    },
    shim: {
    }
});

require(['app/dd-app', 'routes', 'core/context'], function(APP, routes, context) {
    'use strict';

    APP.navigate = routes.navigate;

    var showAppMain = function() {
        APP.userEnter(function(userInfo) {
            // console.log(userInfo);
            if (userInfo) context['user-info'] = userInfo;
            APP.navigate('psngr-main');
        });
    };

    window.setTimeout(showAppMain, 2000);

});