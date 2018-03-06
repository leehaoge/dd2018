define(['app/dd-constants', 'core/context', 'app/dd-app'], function (CONSTS, context, APP) {
    'use strict';

    function executeCallback(cb) {
        if (cb && $.isFunction(cb)) {
            var args = arguments;
            Array.prototype.shift.apply(args);
            cb.apply(null, args);
        }
    }

    var geolocation = new qq.maps.Geolocation(CONSTS['MAP_KEY'], CONSTS['APP_NAME']),
        module = {
            icons: {},
            trip: {
                start: undefined,
                end: undefined,
                distance: undefined,
                duration: undefined
            },
            getCurrentPosition: function (onSuccess, onError, options) {
                geolocation.getLocation(onSuccess, onError, options);
            },
            createMap: function (el, options) {
                return new qq.maps.Map(el, options);
            },
            onPositionChanged: function (position) {
                if (!(position instanceof qq.maps.LatLng)) {
                    position = new qq.maps.LatLng(position.lat, position.lng);
                }
                if (this.centerMark === undefined && this.map !== undefined) {
                    this.centerMark = new qq.maps.Marker({
                        icon: this.icons['center-mark'],
                        map: this.map,
                        position: position
                    });
                } else {
                    this.centerMark.setPosition(position);
                }
            },
            /**
             * 启动位置监视
             */
            startPositionWatch: function () {
                geolocation.watchPosition(this.onPositionChanged.bind(this));
            },
            /**
             * 触发事件
             */
            emit: function (event) {
                if (this.listener && this.listener[event]) {
                    var args = arguments;
                    Array.prototype.shift.apply(args);
                    this.listener[event].apply(null, args);
                }
            },
            /**
             * 获得经纬度的地址
             */
            getAddress: function (position) {
                this.addressGetter.getAddress(position);
            },
            startMap: function (position) {
                var self = this,
                    el = document.getElementById('map');
                this.map = this.createMap(el, {
                    mapTypeControl: false,
                    center: position,
                    zoom: 15
                });
                this.centerMark = undefined;
                //-->create center mark
                var anchor = new qq.maps.Point(12, 12),
                    size = new qq.maps.Size(24, 24),
                    origin = new qq.maps.Point(0, 0),
                    icon = new qq.maps.MarkerImage('img/center.gif', size, origin, anchor);
                this.icons['center-mark'] = icon;
                //create position marker layer
                this.selectMarker = document.createElement("div");
                this.selectMarker.style.left = Math.floor((context['app'].winWidth - 36) / 2) + "px";
                this.selectMarker.style.top = Math.floor((context['app'].winHeight - 30) / 2 - 36) + "px";
                this.selectMarker.style.position = "relative";
                this.selectMarker.style.width = "36px";
                this.selectMarker.style.height = "36px";
                this.selectMarker.style.zIndex = "100";
                this.selectMarker.innerHTML = '<img src="img/icon-location.png" />';
                el.appendChild(this.selectMarker);
                //create address decoder
                this.addressGetter = new qq.maps.Geocoder({
                    complete: function (result) {
                        // console.log(result);
                        self.emit('onGetLatLngAddress', result);
                    }
                });
                //dragstart事件
                //dragend事件
                qq.maps.event.addListener(this.map, 'dragstart', function () {
                    console.log('开始重新定位起点');
                });
                qq.maps.event.addListener(this.map, 'dragend', function () {
                    console.log('重新定位起点');
                    self.trip.start = self.map.getCenter();
                    self.getAddress(self.trip.start);
                });

                this.onPositionChanged(position);
                this.startPositionWatch();
                this.trip.start = this.map.getCenter();
                this.getAddress(this.trip.start);
                this.emit("onStartMap");
            },
            init: function (mapListener) {
                var self = this,
                    defaultCenter = new qq.maps.LatLng(22.251924, 112.794065) //<-- 台山
                    ;
                this.listener = mapListener;
                this.getCurrentPosition(function (position) {
                    //定位成功！
                    var pt = new qq.maps.LatLng(position.lat, position.lng);
                    self.startMap(pt);
                    self.emit("locationChanged", position.city);
                }, function () {
                    //定位失败
                    console.log('定位失败！');
                    self.startMap(defaultCenter);
                }, {
                        timeout: 5000
                    });
            },
            shortestLoc: function (nearPois) {
                var ret = null;
                if (this.trip.start && nearPois && !_.isEmpty(nearPois)) {
                    var minDis = 99999999999;
                    for (var i in nearPois) {
                        var poi = nearPois[i],
                            dis = poi.dist;
                        if (dis < minDis) {
                            minDis = dis;
                            ret = poi;
                            if (dis === 0) break;
                        }
                    }
                } 
                return ret;
            }
        };

    return module;
});