define(['psngr/main', 'psngr/start', 'psngr/target', 'psngr/calling'],
    function (pgMain, pgStart, pgTarget, pgCalling) {
        'use strict';

        var PAGE_EL = 'page-wrapper',
            getPageEl = function () {
                return document.getElementById(PAGE_EL);
            }, pages = {
                'psngr-main': function (config, cb) {
                    pgMain.show(getPageEl(), config, cb);
                },
                'psngr-start': function (config, cb) {
                    pgStart.show(getPageEl(), config, cb);
                },
                'psngr-target': function (config, cb) {
                    pgTarget.show(getPageEl(), config, cb);
                },
                'calling': function(config, cb) {
                    pgCalling.show(getPageEl(), config, cb);
                }
            };

        return pages;

    });