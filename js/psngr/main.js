define(['text!html/psngr/main.html', 'core/fragment', 'app/dd-app', 'core/context', 'psngr/map',
    'psngr/poi-search', 'app/dd-constants'],
    function (tpl, Fragment, APP, context, map, poiSearch, CONSTS) {
        'use strict';

        var conf, module, poiType, drivingService,
            mapListener = {
                "onGetLatLngAddress": function (result) {
                    var poi = map.shortestLoc(result.detail.nearPois);
                    // result.detail.address;
                    // if (_.isEmpty(result.detail.addressComponents.streetNumber)) {
                    //     addr = map.shortestLoc(result.detail.nearPois);
                    // }
                    if (poi) {
                        gotPoi(1, poi);
                    }
                },
                "onStartMap": function () {
                    poiSearch.initSearchService(null);
                },
                "locationChanged": function(location) {
                    // var m = location.match(/(.*)市$/);
                    // if (m) location = m[1];
                    APP.searchCond.location = location;
                    $('#dd-location').text(location);
                }
            },
            poiListener = {
                "onPoiSelected": function (poi) {
                    poiSearch.hide();
                    gotPoi(poiType, poi);
                }
            };

        poiSearch.setCallbacks(poiListener);

        function createDrivingService() {
            if (drivingService !== undefined) {
                drivingService.clear();
            }
            drivingService = new qq.maps.DrivingService({
                //设置回调函数
                complete: function (result) {
                    if (result.type == qq.maps.ServiceResultType.MULTI_DESTINATION) {
                        alert("起终点不唯一");
                    } else {
                        var tripPrice = Math.ceil(CONSTS["PRICE_KM"] * result.detail.distance / 100) / 10;
                        $('#el-trip-price').text('' + tripPrice);
                        $('#div-trip-price').removeClass('hidden');
                        $('#div-trip-control').removeClass('hidden');
                    }
                },
                //设置检索失败回调函数
                error: function (data) {
                    alert(data);
                },
                //设置驾车换乘的区域范围
                location: APP.searchCond.location,
                //展现结果的地图实例
                map: map.map,
                //展现结果
                // panel: document.getElementById('infoDiv')
            });    
        }

        function checkTripInfoComplete() {
            if (APP.tripInfo.poiStart && APP.tripInfo.poiTarget) {
                //find out 里程数
                createDrivingService();
                drivingService.search(APP.tripInfo.poiStart, APP.tripInfo.poiTarget);
            }
        }

        function gotPoi(poiType, poi) {
            if (poiType && poiType === 1) {
                APP.tripInfo.poiStart = poi;
                $('#el-where-start').html(poi.name || poi.address);
            }
            if (poiType && poiType === 2) {
                APP.tripInfo.poiTarget = poi;
                $('#el-where-target').html(poi.name || poi.address);
            }
            checkTripInfoComplete();
        }


        function moduleLoaded_old() {
            var $start = $('#el-where-start'),
                $target = $('#el-where-target'),
                hasStart = false, hasTarget = false;
            if (conf.start) {
                hasStart = true;
                $start.html(conf.start);
            } else {
                $start.html('<a href="#" id="ln-where-start">你在哪上车</a>');
            }
            if (conf.target) {
                hasTarget = true;
                $target.html(conf.target);
            } else {
                $target.html('<a href="#" id="ln-where-target">你要去哪儿</a>');
            }

            if (!hasStart || !hasTarget) {
                $('#div-trip-price').addClass('hidden');
                $('#div-trip-control').addClass('hidden');
            } else {
                $('#el-trip-price').html('10.5');
                $('#div-trip-price').removeClass('hidden');
                $('#div-trip-control').removeClass('hidden');
            }

            $('#ln-where-start').click(function () {
                APP.navigate('psngr-start');
            });
            $('#ln-where-target').click(function () {
                APP.navigate('psngr-target');
            });
            $('#btn-calling').click(function () {
                APP.navigate('calling', conf);
            });
        }

        function moduleLoaded() {
            var loc_actions = {
                "where-start": function () {
                    poiSearch.show(poiType = 1);
                },
                "where-target": function () {
                    poiSearch.show(poiType = 2);
                }
            };
            map.init(mapListener);
            $('.dd-location').click(function () {
                var $this = $(this), dataId = $this.attr('data-id');
                if (loc_actions[dataId]) {
                    loc_actions[dataId]();
                }
            });
            $('#poi-cancel').click(function () {
                poiSearch.hide();
            });
            poiSearch.pageLoaded();
        }



        module = {
            show: function (el, config) {
                var fragment = new Fragment(el);
                conf = conf || {};
                conf = $.extend(conf, config);
                fragment.load(tpl, conf, moduleLoaded);
            }
        }

        return module;

    });