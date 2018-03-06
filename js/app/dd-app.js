define(['core/context'], function(context) {
    'use strict';

    var application;

    function userEnter(cb) {
        //now we use a fake data.
        var user = {
            id: 1,
            account: 'user1',
            name: '浩哥',
            phone: '13500000217',
        };
        cb(user);
    }

    function driverEnter(cb) {
        $.ajax({
            url: 'rest/driver/enter',
            type: 'post',
            dataType: 'json',
            success: cb
        });
    }

    function startCalling(cb) {
        var userInfo = context['user-info'];
    }
    
    application = {
        userEnter: userEnter,
        driverEnter: driverEnter,
        searchCond: {
            location: '深圳',
            key: ''
        },
        tripInfo: {
            poiStart: undefined,
            poiTarget: undefined
        }
    };

    return application;

});