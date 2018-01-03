define(['core/core'], function(CORE) {
    'use strict';
    
    var Fragment = function(el) {
        this.el = el;
    };

    var d=CORE.__define,c=Fragment,p=c.prototype;

    p.create = function() {
        this.el = document.createElement('DIV');
    };

    p.load = function(tpl, config, onloaded) {
        var compiled = _.template(tpl);
        config = config || {};
        this.html(compiled(config), onloaded);
    };

    p.html = function(html, onloaded) {
        if (this.el) {
            var $el = $(this.el);
            $el.html(html);
            this.loaded = true;
            //for jquery mobile element
            $el.trigger('create');
            if (onloaded && $.isFunction(onloaded)) onloaded();
        }
    };

    return Fragment;
}); 