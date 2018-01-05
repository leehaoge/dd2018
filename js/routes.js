define(['where-start', 'where-target', 'psngr-main'],
    function (pgStart, pgTarget, pPsngrMain) {
        'use strict';

        var PAGE_EL = 'page-wrapper',
            getPageEl = function () {
                return document.getElementById(PAGE_EL);
            },
            pages = {
                "where-start": function (config, cb) {
                    pgStart.show(getPageEl(), config, cb);
                },
                "where-target": function (config, cb) {
                    pgTarget.show(getPageEl(), config, cb);
                },
                "main": function (config, cb) {
                    pPsngrMain.show(getPageEl(), config, cb);
                },
                _extraRoutes: []
            };

        function navigatePage(page, config, cb) {
            var func;
            if (pages[page]) func = pages[page];
            if (!!!func) {
                for (var i in pages._extraRoutes) {
                    var route = pages._extraRoutes[i];
                    if (route[page]) func = route[page];
                    break;
                }
            }
            if (func) func(config, cb);
        }

        var module = {
            navigate: navigatePage
        };

        return module;
    });