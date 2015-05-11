var PixelPerfect = function(config){
    this.init(config);
};



(function ($,jq) {
    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    function converted(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch(er) {}
    }

    var config = $.cookie ={};
    $.cookie.set = function (key, value, options) {

        // write

            options = jq.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                config.raw ? key : encodeURIComponent(key),
                '=',
                config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
    };

    $.cookie.get = function(key,defaultValue){
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = converted(cookie);
                break;
            }

            if (!key) {
                result[name] = converted(cookie);
            }
        }

        return result==undefined?defaultValue:result;
    }

    config.defaults = {};

    $.cookie.unset = function (key, options) {
        if ($.cookie.get(key) !== undefined) {
            $.cookie.set(key, '', jq.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };

})(PixelPerfect,jQuery);


/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
shortcut = {
    'all_shortcuts':{},//All the shortcuts are stored in this array
    'add': function(shortcut_combination,callback,opt) {
        //Provide a set of default options
        var default_options = {
            'type':'keydown',
            'propagate':false,
            'disable_in_input':false,
            'target':document,
            'keycode':false
        }
        if(!opt) opt = default_options;
        else {
            for(var dfo in default_options) {
                if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
            }
        }

        var ele = opt.target;
        if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
        var ths = this;
        shortcut_combination = shortcut_combination.toLowerCase();

        //The function to be called at keypress
        var func = function(e) {
            e = e || window.event;

            if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
                var element;
                if(e.target) element=e.target;
                else if(e.srcElement) element=e.srcElement;
                if(element.nodeType==3) element=element.parentNode;

                if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
            }

            //Find Which key is pressed
            if (e.keyCode) code = e.keyCode;
            else if (e.which) code = e.which;
            var character = String.fromCharCode(code).toLowerCase();

            if(code == 188) character=","; //If the user presses , when the type is onkeydown
            if(code == 190) character="."; //If the user presses , when the type is onkeydown

            var keys = shortcut_combination.split("+");
            //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
            var kp = 0;

            //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
            var shift_nums = {
                "`":"~",
                "1":"!",
                "2":"@",
                "3":"#",
                "4":"$",
                "5":"%",
                "6":"^",
                "7":"&",
                "8":"*",
                "9":"(",
                "0":")",
                "-":"_",
                "=":"+",
                ";":":",
                "'":"\"",
                ",":"<",
                ".":">",
                "/":"?",
                "\\":"|"
            }
            //Special Keys - and their codes
            var special_keys = {
                'esc':27,
                'escape':27,
                'tab':9,
                'space':32,
                'return':13,
                'enter':13,
                'backspace':8,

                'scrolllock':145,
                'scroll_lock':145,
                'scroll':145,
                'capslock':20,
                'caps_lock':20,
                'caps':20,
                'numlock':144,
                'num_lock':144,
                'num':144,

                'pause':19,
                'break':19,

                'insert':45,
                'home':36,
                'delete':46,
                'end':35,

                'pageup':33,
                'page_up':33,
                'pu':33,

                'pagedown':34,
                'page_down':34,
                'pd':34,

                'left':37,
                'up':38,
                'right':39,
                'down':40,

                'f1':112,
                'f2':113,
                'f3':114,
                'f4':115,
                'f5':116,
                'f6':117,
                'f7':118,
                'f8':119,
                'f9':120,
                'f10':121,
                'f11':122,
                'f12':123
            }

            var modifiers = {
                shift: { wanted:false, pressed:false},
                ctrl : { wanted:false, pressed:false},
                alt  : { wanted:false, pressed:false},
                meta : { wanted:false, pressed:false}	//Meta is Mac specific
            };

            if(e.ctrlKey)	modifiers.ctrl.pressed = true;
            if(e.shiftKey)	modifiers.shift.pressed = true;
            if(e.altKey)	modifiers.alt.pressed = true;
            if(e.metaKey)   modifiers.meta.pressed = true;

            for(var i=0; k=keys[i],i<keys.length; i++) {
                //Modifiers
                if(k == 'ctrl' || k == 'control') {
                    kp++;
                    modifiers.ctrl.wanted = true;

                } else if(k == 'shift') {
                    kp++;
                    modifiers.shift.wanted = true;

                } else if(k == 'alt') {
                    kp++;
                    modifiers.alt.wanted = true;
                } else if(k == 'meta') {
                    kp++;
                    modifiers.meta.wanted = true;
                } else if(k.length > 1) { //If it is a special key
                    if(special_keys[k] == code) kp++;

                } else if(opt['keycode']) {
                    if(opt['keycode'] == code) kp++;

                } else { //The special keys did not match
                    if(character == k) kp++;
                    else {
                        if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
                            character = shift_nums[character];
                            if(character == k) kp++;
                        }
                    }
                }
            }

            if(kp == keys.length &&
                modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
                modifiers.shift.pressed == modifiers.shift.wanted &&
                modifiers.alt.pressed == modifiers.alt.wanted &&
                modifiers.meta.pressed == modifiers.meta.wanted) {
                callback(e);

                if(!opt['propagate']) { //Stop the event
                    //e.cancelBubble is supported by IE - this will kill the bubbling process.
                    e.cancelBubble = true;
                    e.returnValue = false;

                    //e.stopPropagation works in Firefox.
                    if (e.stopPropagation) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    return false;
                }
            }
        }
        this.all_shortcuts[shortcut_combination] = {
            'callback':func,
            'target':ele,
            'event': opt['type']
        };
        //Attach the function with the event
        if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
        else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
        else ele['on'+opt['type']] = func;
    },

    //Remove the shortcut - just specify the shortcut and I will remove the binding
    'remove':function(shortcut_combination) {
        shortcut_combination = shortcut_combination.toLowerCase();
        var binding = this.all_shortcuts[shortcut_combination];
        delete(this.all_shortcuts[shortcut_combination])
        if(!binding) return;
        var type = binding['event'];
        var ele = binding['target'];
        var callback = binding['callback'];

        if(ele.detachEvent) ele.detachEvent('on'+type, callback);
        else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
        else ele['on'+type] = false;
    }
}

var Overlay = {
    images:[],
    currentImageIndex:0,
    init:function(config){
        config = $.extend({},this.defaults,config);
        this.basePath = config.basePath;
        var images = config.images;
        for(var i in images){
            var expr = new RegExp(i);
            var res = expr.test(window.location.pathname);
            if(res){
                if( typeof images[i] === 'string' ) {
                    images[i] = [ images[i] ];
                }
                this.images = images[i];
                break;
            }
        }
        if(this.images.length==0){
            if( typeof images['_default_'] === 'string' ) {
                images['_default_'] = [ images['_default_'] ];
            }
            this.images = images['_default_'];
        }

        var currentImageIndex = parseInt(PixelPerfect.cookie.get('mk_img_current',0));
        if(this.images[currentImageIndex]!=undefined){
            this.currentImageIndex = currentImageIndex;
        }

        this.configDiv();
    },
    getDiv:function(){
        var div = $('#markup-overlay');
        if(div.size()==0){
            div = $('<div id="markup-overlay">');
            $('body').prepend(div);
        }
        return div;
    },
    configDiv:function(){
        var div = this.getDiv();
        var imgPath = this.basePath+this.images[this.currentImageIndex]
        //$('body').css('overflow-x','hidden');
        div.css({
            width:$('body').innerWidth(),
            height:$(document).innerHeight(),
            background:"url("+imgPath+") left top no-repeat",
            top:PixelPerfect.cookie.get('mk_top',0)+'px',
            left:PixelPerfect.cookie.get('mk_left',0)+'px',
            display:'none',
            position:'absolute',
            'z-index':9999,
            opacity:'0.5'
        });
    },
    show:function(){
        this.getDiv().show();
    },
    hide:function(){
        this.getDiv().hide();
    },
    toogle:function(){
        if(this.getDiv().css('display')!='block'){
            this.show();
        }else{
            this.hide();
        }
    },
    opacityUp:function(){
        this.getDiv().css('opacity',parseFloat(this.getDiv().css('opacity'))+0.1);
    },
    opacityDown:function(){
        this.getDiv().css('opacity',parseFloat(this.getDiv().css('opacity'))-0.1);
    },
    nextImage:function(){
        var index = this.currentImageIndex+1;
        var image = this.images[index];
        if(image!=undefined){
            this.currentImageIndex = index;
        }else{
            index = this.currentImageIndex = 0;
            image = this.images[index];
        }
        PixelPerfect.cookie.set('mk_img_current',index);
        this.getDiv().css('background-image',"url("+this.basePath+image+")");
    },
    prevImage:function(){
        var index = this.currentImageIndex-1;
        var image = this.images[index];
        if(image!=undefined){
            this.currentImageIndex = index;
        }else{
            index = this.currentImageIndex = this.images.length-1;
            image = this.images[index];
        }
        PixelPerfect.cookie.set('mk_img_current',index);
        this.getDiv().css('background-image',"url("+this.basePath+image+")");
    },
    moveUp:function(){
        var div = this.getDiv();
        var val = parseInt(div.css('top').replace('px',''))-1;
        div.css('top',val);
        PixelPerfect.cookie.set('mk_top',val);
    },
    moveDown:function(){
        var div = this.getDiv();
        var val = parseInt(div.css('top').replace('px',''))+1;
        div.css('top',val);
        PixelPerfect.cookie.set('mk_top',val);
    },
    moveLeft:function(){
        var div = this.getDiv();
        var val = parseInt(div.css('left').replace('px',''))-1;
        div.css('left',val);
        PixelPerfect.cookie.set('mk_left',val);
    },
    moveRight:function(){
        var div = this.getDiv();
        var val = parseInt(div.css('left').replace('px',''))+1;
        div.css('left',val);
        PixelPerfect.cookie.set('mk_left',val);
    },
    resetPosition:function(){
        this.getDiv().css({top:0,left:0});
        PixelPerfect.cookie.set('mk_left',0);
        PixelPerfect.cookie.set('mk_top',0);
    },
    defaults:{
        basePath:'overlays/'
    }
}

PixelPerfect.prototype.init = function(config){
    Overlay.init(config.overlay);
    shortcut.add('Alt+1', $.proxy(Overlay.toogle,Overlay));
    shortcut.add('Alt+down', $.proxy(Overlay.opacityDown,Overlay));
    shortcut.add('Alt+up', $.proxy(Overlay.opacityUp,Overlay));
    shortcut.add('Alt+left', $.proxy(Overlay.prevImage,Overlay));
    shortcut.add('Alt+right', $.proxy(Overlay.nextImage,Overlay));
    shortcut.add('Ctrl+right', $.proxy(Overlay.moveRight,Overlay));
    shortcut.add('Ctrl+left', $.proxy(Overlay.moveLeft,Overlay));
    shortcut.add('Ctrl+up', $.proxy(Overlay.moveUp,Overlay));
    shortcut.add('Ctrl+down', $.proxy(Overlay.moveDown,Overlay));
}