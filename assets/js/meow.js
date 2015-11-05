// no, we don't really need jQuery for everything
(function() {

    'use strict';

    var Meow = function(query) {

        if (!(this instanceof Meow)) {
            return new Meow(query);
        }

        if (query) {
            this.el = document.querySelectorAll(query);
        }
    };

    window.$ = Meow;

    Meow.each = function (collection, callback) {

        var l = collection.length;

        //console.log(callback);

        for (var i = 0; i < l; i++) {
            callback.call(collection[i], collection[i], i);
        }

        return this;
    };

    // events
    Meow.on = function(elem, eventName, handler) {

        if (elem.addEventListener) {
            elem.addEventListener(eventName, handler);
        } else {
            elem.attachEvent('on' + eventName, function(){
                handler.call(elem);
            });
        }
        return this;
    };

    Meow.hasClass = function(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    };

    Meow.addClass = function(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    };

    Meow.removeClass = function(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    Meow.prototype.each = function(func) {
        //Array.prototype.forEach.call( elem, func);
        Meow.each(this.el, func);
    };

    Meow.prototype.on = function(eventName, callback) {
        Meow.each(this.el, function(e) {
            Meow.on(e, eventName, callback);
        });
    };

    Meow.prototype.isArray = function(arr) {
        return Array.isArray(arr);
    };

    Meow.prototype.addClass = function(className) {
        Meow.each(this.el, function(){
            Meow.addClass(this, className);
        });

        return this;
    };

    Meow.prototype.removeClass = function(className) {
        Meow.each(this.el, function(){
            Meow.removeClass(this, className);

        });

        return this;
    };

    Meow.prototype.toggleClass = function(className) {

        Meow.each(this.el, function(elem){
            if (elem.classList) {
                elem.classList.toggle(className);
            } else {
                var classes = elem.className.split(' ');
                var existingIndex = -1;
                for (var i = classes.length; i--;) {
                if (classes[i] === className)
                existingIndex = i;
                }

                if (existingIndex >= 0)
                classes.splice(existingIndex, 1);
                else
                classes.push(className);

                elem.className = classes.join(' ');
            }
        });

        return this;
    };

    // until position: sticky becomes reality

    Meow.prototype.sticky = function(options) {

        if (typeof options === 'undefined') {
            var options = {};
        }

        options = {
            permanent: ( options.hasOwnProperty('permanent') ) ? options.permanent : true,
            offsetTop: ( options.hasOwnProperty('offsetTop') ) ? options.offsetTop : 0,
            setLeft: ( options.hasOwnProperty('setLeft') ) ?  options.setLeft : true,
            triggers: []
        }


        var that = this;

        if (that.el.length < 1) {
            return false;
        }

        Meow.each(that.el, function(e) {

            var offsetTop = parseInt(this.getBoundingClientRect().top) + window.scrollY - parseInt(this.offsetHeight) - parseInt(options.offsetTop); // trigger point
            var offsetLeft = e.getBoundingClientRect().left;
            var originalLeft = window.getComputedStyle(e,null).getPropertyValue("left");


            options.triggers.push({
                trigger: offsetTop,
                target: this,
                offsetTop: offsetTop,
                offsetLeft: offsetLeft,
                originalLeft: originalLeft,
            });

        });

        Meow.on(window, 'scroll', function() {
            var doc = document.documentElement;
            var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

            for (var i = 0; i < options.triggers.length; i++) {

                var e = options.triggers[i].target;
                var o = options.triggers[i];

                if (o.trigger < top) {
                    if (! Meow.hasClass(e, 'sticky') ) {
                        Meow.addClass(e, 'sticky');

                        if ( options.setLeft ) { e.style.left = o.offsetLeft +'px';  }
                    }


                } else {
                    if ( Meow.hasClass(e, 'sticky') ) {

                        Meow.removeClass(e, 'sticky');

                        if ( options.setLeft ) { e.style.left = o.originalLeft;  }
                    }
                }
            }

        });

        Meow.on(window, 'resize', function() {
            var timeout;

            clearTimeout(timeout);
            setTimeout( function() {

                for (var i = 0; i < options.triggers.length; i++) {
                    var e = options.triggers[i].target;
                    var o = options.triggers[i];

                    if ( Meow.hasClass(e, 'sticky') ) {

                        var clone = e.cloneNode(true);
                        clone.id = clone.id + '-clone';
                        $.addClass(clone, 'clone');
                        $.removeClass(clone, 'sticky');

                        clone = e.parentNode.appendChild(clone);

                        if ( options.setLeft ) {
                            clone.style.left = o.originalLeft;
                        }

                        o.offsetLeft = clone.getBoundingClientRect().left;
                        o.originalLeft = window.getComputedStyle(clone,null).getPropertyValue("left");
                        o.offsetTop = parseInt(clone.getBoundingClientRect().top) + window.scrollY - parseInt(clone.offsetHeight) - parseInt(options.offsetTop);

                        clone.parentNode.removeChild(clone);

                        if ( options.setLeft ) {
                            e.style.left = o.offsetLeft + 'px';
                        }

                    } else {

                        o.offsetLeft = e.getBoundingClientRect().left;
                        o.originalLeft = window.getComputedStyle(e,null).getPropertyValue("left");
                        o.offsetTop = parseInt(e.getBoundingClientRect().top) + window.scrollY - parseInt(e.offsetHeight) - parseInt(options.offsetTop);
                    }

                    o.trigger = o.offsetTop;
                }
            });
        });

        return this;
    };

    Meow.prototype.magic = function(options) {

        if (typeof options == "undefined") {
            var options = {};
        }

        options = {
            offsetTop: ( options.hasOwnProperty('offsetTop') ) ? options.offsetTop : 350,
            reverse: ( options.hasOwnProperty('reverse') ) ?  options.reverse : true,
            firstVisible: ( options.hasOwnProperty('firstVisible') ) ?  options.firstVisible : false,

            triggers: []
        }


        var that = this;

        if (that.el.length < 1) {
            return false;
        }

        Meow.each(that.el, function() {

            var elemOffsetTop = parseInt(this.getBoundingClientRect().top) + window.scrollY - parseInt(this.offsetHeight) - parseInt(options.offsetTop);


            options.triggers.push({
                trigger: elemOffsetTop,
                target: this
            });

        });

        if ( options.firstVisible ) {
            Meow.addClass(that.el[0], 'show');
        }

        Meow.on(window, 'scroll', function() {
            var doc = document.documentElement;
            var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

            for (var i = 0; i < options.triggers.length; i++) {

                if (options.triggers[i]['trigger'] < top) {
                    if (! Meow.hasClass(options.triggers[i]['target'], 'show') ) {
                        Meow.addClass(options.triggers[i]['target'], 'show');
                    }


                } else {
                    if ( Meow.hasClass(options.triggers[i]['target'], 'show') && options.reverse ) {

                        Meow.removeClass(options.triggers[i]['target'], 'show');
                    }
                }
            }

        });

        return this;
    };

})();
