define(['app/dd-app'], function (APP) {
    'use strict';

    var templates = {
        "poi-list": '<div style="position: relative; height: 20px; line-height: 20px; background-color: rgb(243, 243, 243); font-size: 12px; color: rgb(153, 153, 153); padding: 0px 5px;">\
        <span>搜索结果(共<%=totalNum%>条)</span>\
    </div>\
    <ol id="search-result" style="list-style: none; padding: 0px; margin: 0px;">\
    </ol>',
        "poi-item": '<li class="dd-poi-item" data-id="<%=id%>" style="margin:2px 0;padding:0 5px;cursor:pointer;zoom:1;">\
        <div style="float: left;display:inline;width:20px;height: 20px;line-height:20px;overflow: hidden;text-align: center;"><%=itemNum%>.</div>\
        <div style="overflow: hidden;padding:0 5px;zoom:1;">\
            <div style="color:#0059B3;"><%=name%></div>\
            <div>\
                <div>\
                    <span style="color:#999999;font-size:12px;"><%=address%></span>\
                </div>\
                <div>\
                    <span style="color:#999999;font-size:12px;"><%=phone%></span>\
                </div>\
            </div>\
        </div>\
    </li>'
    };    
    var searchService, poiLoaded = {
    }, module = {
        initSearchService: function (map) {
            var self = this;
            searchService = new qq.maps.SearchService({
                map: map,
                // panel: document.getElementById('poi-panel'),
                complete: function (result) {
                    poiLoaded.pageCapacity = result.detail.pageCapacity;
                    poiLoaded.pageIndex = result.detail.pageIndex;
                    poiLoaded.totalNum = result.detail.totalNum;
                    poiLoaded.pois = poiLoaded.pois || [];
                    var itemIndex = poiLoaded.pageIndex * poiLoaded.pageCapacity + 1;
                    var funcItem = _.template(templates['poi-item']);

                    if (poiLoaded.pageIndex === 0) {
                        var funcList = _.template(templates['poi-list']);
                        $('#poi-list').html(funcList(poiLoaded));
                    }

                    $('.dd-poi-item').off('click');
                    for (var i in result.detail.pois) {
                        var poi = result.detail.pois[i];
                        if (poi.id) {
                            poi.itemNum = itemIndex++;
                            poi.address = poi.address || '';
                            poi.phone = poi.phone || '';
                            poiLoaded.pois.push(poi);
                            $('#search-result').append(funcItem(poi));    
                        }
                    }
                    setTimeout(function () {
                        $('.dd-poi-item').click(function() {
                            var $this = $(this), dataId = $this.attr('data-id');
                            var poi = _.findWhere(poiLoaded.pois, {id: dataId});
                            if (poi) {
                                self.emit("onPoiSelected", poi);
                            }
                        });

                        if (result.detail.totalNum > itemIndex) {
                            $('#pullUp').css('display', 'block');
                        } else {
                            $('#pullUp').css('display', 'none');
                        }
                    }, 300);
                },
                error: function () {
                    $('#pullUp').css('display', 'none');
                    $('#poi-list').html('<div>抱歉，未找到您要的地点</div><div>请检查您的关键字是否正确。</div>');
                }
            });

        },
        pageLoaded: function () {
            $('#pullUp').css('display', 'none');
            $('#pullUp').click(function() {
                //search next page!
                searchService.pageIndex = poiLoaded.pageIndex + 1;
                searchService.setLocation(APP.searchCond.location);
                searchService.search(APP.searchCond.key);
            });
            var intvSearch;
            $('#dd-poi-keyword').keydown(function () {
                var $this = $(this);
                if (intvSearch !== undefined) {
                    clearTimeout(intvSearch);
                }
                intvSearch = setTimeout(function () {
                    var key = $this.val();
                    $('#poi-list').html('');
                    intvSearch = undefined;
                    APP.searchCond = APP.searchCond || {};
                    APP.searchCond.location = $('#dd-location').text();
                    APP.searchCond.key = key;
                    if (searchService) {
                        //in case the search service not initialized properly
                        searchService.setLocation(APP.searchCond.location);
                        searchService.setPageIndex(0);
                        searchService.search(key);    
                    }
                }, 500);
            });
        },
        /**
         * poiType: 1=>start, 2=>target
         */
        show: function(poiType) {
            switch (poiType) {
                case 1:
                $('#dd-poi-keyword').attr('placeholder', '你在哪上车');
                break;
                case 2:
                $('#dd-poi-keyword').attr('placeholder', '你要去哪里');
                break;
            }
            $('#poi-list').html('');
            $('#pullUp').css('display', 'none');
            $('#poi-search').css('display', 'block');
        },
        hide: function() {
            $('#dd-poi-keyword').val('');
            $('#poi-search').css('display', 'none');
        },
        setCallbacks: function(listener) {
            this.listener = listener;
        },
        emit: function(event){
            if (this.listener && this.listener[event]) {
                var args = arguments;
                Array.prototype.shift.apply(args);
                this.listener[event].apply(null, args);
            }
        }
    };

    return module;
});