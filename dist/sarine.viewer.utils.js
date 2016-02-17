/*
sarine.viewer.utils - v1.9.0 -  Wednesday, February 17th, 2016, 2:57:32 PM 
*/
$(function() {
     if (typeof utilsManager !== 'undefined'){
    	if(!utilsManager.IsMobile()){ 
    		  $.reject({
                reject: {
                    msie:9                   
                },
                close: false, // Prevent closing of window ,
                header: 'Your browser version is out of date',
                display: ['chrome', 'safari', 'firefox', 'msie'],
                imagePath:'//d3n02ovm6tlpii.cloudfront.net/content/viewers/shell/v1/images/'
            });

    		 if(typeof vm !== 'undefined') //stop viewers
    		 	vm.stop();

            return false;  
    	}
    }
});
/*!
 * jReject (jQuery Browser Rejection Plugin)
 * Version 1.1.x 
 * URL: http://jreject.turnwheel.com/
 * Description: jReject is a easy method of rejecting specific browsers on your site
 * Author: Steven Bower (TurnWheel Designs) http://turnwheel.com/
 * Copyright: Copyright (c) 2009-2014 Steven Bower under dual MIT/GPLv2 license.
 */

(function($) {
$.reject = function(options) {
	var opts = $.extend(true, {   		
		reject : {
			all: false, // Covers Everything (Nothing blocked)
			msie: 6 // Covers MSIE <= 6 (Blocked by default)			
		},
		display: [], // What browsers to display and their order (default set below)
		browserShow: true, // Should the browser options be shown?
		browserInfo: { // Settings for which browsers to display
			chrome: {				
				text: 'Google Chrome',// Text below the icon				
				url: 'http://www.google.com/chrome/'// URL For icon/text link			
			},
			firefox: {
				text: 'Mozilla Firefox',
				url: 'http://www.mozilla.com/firefox/'
			},
			safari: {
				text: 'Safari',
				url: 'http://www.apple.com/safari/download/'
			},
			opera: {
				text: 'Opera',
				url: 'http://www.opera.com/download/'
			},
			msie: {
				text: 'Internet Explorer',
				url: 'http://www.microsoft.com/windows/Internet-explorer/'
			}
		},

		// Pop-up Window Text
		header: 'Did you know that your Internet Browser is out of date?',

		paragraph1: 'Your browser is out of date, and may not be compatible with '+
					'our website. A list of the most popular web browsers can be '+
					'found below.',

		paragraph2: 'Just click on the icons to get to the download page',

		
		close: true,// Allow closing of window

		
		closeMessage: 'By closing this window you acknowledge that your experience '+
						'on this website may be degraded',
		closeLink: 'Close This Window',
		closeURL: '#',

		
		closeESC: true,// Allows closing of window with esc key

		
		closeCookie: false,// Use cookies to remmember if window was closed previously?		
		cookieSettings: {
			path: '/',
			expires: 0
		},

		
		imagePath: './images/',// Path where images are located
		
		overlayBgColor: '#000',// Background color for overlay
		
		overlayOpacity: 0.8,// Background transparency (0-1)

		
		fadeInTime: 'fast',// Fade in time on open ('slow','medium','fast' or integer in ms)
		
		fadeOutTime: 'fast',// Fade out time on close ('slow','medium','fast' or integer in ms)	
	
		analytics: false// Google Analytics Link Tracking (Optional)
	}, options);

	// Set default browsers to display if not already defined
	if (opts.display.length < 1) {
		opts.display = [ 'chrome','firefox','safari','opera','msie' ];
	}
	
	if ($.isFunction(opts.beforeReject)) {
		opts.beforeReject();
	}
	
	if (!opts.close) {
		opts.closeESC = false;
	}
	
	var browserCheck = function(settings) {		
		var layout = settings[$.layout.name],
			browser = settings[$.browser.name];
		return !!(settings['all']
			|| (browser && (browser === true || $.browser.versionNumber <= browser))
			|| settings[$.browser.className]
			|| (layout && (layout === true || $.layout.versionNumber <= layout))
			|| settings[$.os.name]);
	};

	
	if (!browserCheck(opts.reject)) {	
		if ($.isFunction(opts.onFail)) {
			opts.onFail();
		}

		return false;
	}

	
	if (opts.close && opts.closeCookie) {	
		var COOKIE_NAME = 'jreject-close';

		var _cookie = function(name, value) {
		
			if (typeof value != 'undefined') {
				var expires = '';

		
				if (opts.cookieSettings.expires !== 0) {
					var date = new Date();
					date.setTime(date.getTime()+(opts.cookieSettings.expires*1000));
					expires = "; expires="+date.toGMTString();
				}
		
				var path = opts.cookieSettings.path || '/';
				
				document.cookie = name+'='+
					encodeURIComponent((!value) ? '' : value)+expires+
					'; path='+path;

				return true;
			}			
			else {
				var cookie,val = null;

				if (document.cookie && document.cookie !== '') {
					var cookies = document.cookie.split(';');

			
					var clen = cookies.length;
					for (var i = 0; i < clen; ++i) {
						cookie = $.trim(cookies[i]);

			
						if (cookie.substring(0,name.length+1) == (name+'=')) {
							var len = name.length;
							val = decodeURIComponent(cookie.substring(len+1));
							break;
						}
					}
				}

				
				return val;
			}
		};
		
		if (_cookie(COOKIE_NAME)) {
			return false;
		}
	}
	
	var html = '<div id="jr_overlay"></div><div id="jr_wrap"><div id="jr_inner">'+
		'<h1 id="jr_header">'+opts.header+'</h1>'+
		(opts.paragraph1 === '' ? '' : '<p>'+opts.paragraph1+'</p>')+
		(opts.paragraph2 === '' ? '' : '<p>'+opts.paragraph2+'</p>');

	var displayNum = 0;
	if (opts.browserShow) {
		html += '<ul>';

		
		for (var x in opts.display) {
			var browser = opts.display[x]; // Current Browser
			var info = opts.browserInfo[browser] || false; // Browser Information
		
			if (!info || (info['allow'] != undefined && !browserCheck(info['allow']))) {
				continue;
			}

			var url = info.url || '#'; // URL to link text/icon to
			
			html += '<li id="jr_'+browser+'"><div class="jr_icon"></div>'+
					'<div><a href="'+url+'">'+(info.text || 'Unknown')+'</a>'+
					'</div></li>';

			++displayNum;
		}

		html += '</ul>';
	}

	
	html += '<div id="jr_close">'+
	
	(opts.close ? '<a href="'+opts.closeURL+'">'+opts.closeLink+'</a>'+
		'<p>'+opts.closeMessage+'</p>' : '')+'</div>'+
	
	'</div></div>';

	var element = $('<div>'+html+'</div>'); // Create element
	var size = _pageSize(); // Get page size
	var scroll = _scrollSize(); // Get page scroll

	
	element.bind('closejr', function() {
		
		if (!opts.close) {
			return false;
		}

		
		if ($.isFunction(opts.beforeClose)) {
			opts.beforeClose();
		}

		
		$(this).unbind('closejr');

		
		$('#jr_overlay,#jr_wrap').fadeOut(opts.fadeOutTime,function() {
			$(this).remove(); // Remove element from DOM

			
			if ($.isFunction(opts.afterClose)) {
				opts.afterClose();
			}
		});

		
		var elmhide = 'embed.jr_hidden, object.jr_hidden, select.jr_hidden, applet.jr_hidden';
		$(elmhide).show().removeClass('jr_hidden');

		
		if (opts.closeCookie) {
			_cookie(COOKIE_NAME, 'true');
		}

		return true;
	});

	
	var analytics = function(url) {
		if (!opts.analytics) {
			return false;
		}

		
		var host = url.split(/\/+/g)[1];

		
		try {
			
			ga('send', 'event', 'External', 'Click', host, url);
		} catch (e) {
			try {
				_gaq.push([ '_trackEvent', 'External Links',  host, url ]);
			} catch (e) { }
		}
	};

	
	var openBrowserLinks = function(url) {
		
		analytics(url);

	
		window.open(url, 'jr_'+ Math.round(Math.random()*11));

		return false;
	};

	
	element.find('#jr_overlay').css({
		width: size[0],
		height: size[1],
		background: opts.overlayBgColor,
		opacity: opts.overlayOpacity
	});

	
	element.find('#jr_wrap').css({
		top: scroll[1]+(size[3]/4),
		left: scroll[0]
	});

	
	element.find('#jr_inner').css({
		minWidth: displayNum*100,
		maxWidth: displayNum*140,
		
		width: $.layout.name == 'trident' ? displayNum*155 : 'auto'
	});

	element.find('#jr_inner li').css({ // Browser list items (li)
		background: 'transparent url("'+opts.imagePath+'background_browser.gif") '+
					'no-repeat scroll left top'
	});

	element.find('#jr_inner li .jr_icon').each(function() {
		
		var self = $(this);
		self.css('background','transparent url('+opts.imagePath+'browser_'+
				(self.parent('li').attr('id').replace(/jr_/,''))+'.gif)'+
					' no-repeat scroll left top');

		
		self.click(function () {
			var url = $(this).next('div').children('a').attr('href');
			openBrowserLinks(url);
		});
	});

	element.find('#jr_inner li a').click(function() {
		openBrowserLinks($(this).attr('href'));
		return false;
	});

	
	element.find('#jr_close a').click(function() {
		$(this).trigger('closejr');

		
		if (opts.closeURL === '#') {
			return false;
		}
	});

	
	$('#jr_overlay').focus();

	
	$('embed, object, select, applet').each(function() {
		if ($(this).is(':visible')) {
			$(this).hide().addClass('jr_hidden');
		}
	});

	
	$('body').append(element.hide().fadeIn(opts.fadeInTime));

	
	$(window).bind('resize scroll',function() {
		var size = _pageSize(); // Get size

		
		$('#jr_overlay').css({
			width: size[0],
			height: size[1]
		});

		var scroll = _scrollSize(); // Get page scroll

		
		$('#jr_wrap').css({
			top: scroll[1] + (size[3]/4),
			left: scroll[0]
		});
	});

	
	if (opts.closeESC) {
		$(document).bind('keydown',function(event) {
			// ESC = Keycode 27
			if (event.keyCode == 27) {
				element.trigger('closejr');
			}
		});
	}

	
	if ($.isFunction(opts.afterReject)) {
		opts.afterReject();
	}

	return true;
};


var _pageSize = function() {
	var xScroll = window.innerWidth && window.scrollMaxX ?
				window.innerWidth + window.scrollMaxX :
				(document.body.scrollWidth > document.body.offsetWidth ?
				document.body.scrollWidth : document.body.offsetWidth);

	var yScroll = window.innerHeight && window.scrollMaxY ?
				window.innerHeight + window.scrollMaxY :
				(document.body.scrollHeight > document.body.offsetHeight ?
				document.body.scrollHeight : document.body.offsetHeight);

	var windowWidth = window.innerWidth ? window.innerWidth :
				(document.documentElement && document.documentElement.clientWidth ?
				document.documentElement.clientWidth : document.body.clientWidth);

	var windowHeight = window.innerHeight ? window.innerHeight :
				(document.documentElement && document.documentElement.clientHeight ?
				document.documentElement.clientHeight : document.body.clientHeight);

	return [
		xScroll < windowWidth ? xScroll : windowWidth, // Page Width
		yScroll < windowHeight ? windowHeight : yScroll, // Page Height
		windowWidth,windowHeight
	];
};



var _scrollSize = function() {
	return [
		
		window.pageXOffset ? window.pageXOffset : (document.documentElement &&
				document.documentElement.scrollTop ?
				document.documentElement.scrollLeft : document.body.scrollLeft),

		
		window.pageYOffset ? window.pageYOffset : (document.documentElement &&
				document.documentElement.scrollTop ?
				document.documentElement.scrollTop : document.body.scrollTop)
	];
};
})(jQuery);


(function ($) {
	$.browserTest = function (a, z) {
		var u = 'unknown',
			x = 'X',
			m = function (r, h) {
				for (var i = 0; i < h.length; i = i + 1) {
					r = r.replace(h[i][0], h[i][1]);
				}

				return r;
			}, c = function (i, a, b, c) {
				var r = {
					name: m((a.exec(i) || [u, u])[1], b)
				};

				r[r.name] = true;

				if (!r.opera) {
					r.version = (c.exec(i) || [x, x, x, x])[3];
				}
				else {
					r.version = window.opera.version();
				}

				if (/safari/.test(r.name)) {
					var safariversion = /(safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/;
					var res = safariversion.exec(i);
					if (res && res[3] && res[3] < 400) {
						r.version = '2.0';
					}
				}

				else if (r.name === 'presto') {
					r.version = ($.browser.version > 9.27) ? 'futhark' : 'linear_b';
				}

				if (/msie/.test(r.name) && r.version === x) {
					var ieVersion = /rv:(\d+\.\d+)/.exec(i);
					r.version = ieVersion[1];
				}

				r.versionNumber = parseFloat(r.version, 10) || 0;
				var minorStart = 1;

				if (r.versionNumber < 100 && r.versionNumber > 9) {
					minorStart = 2;
				}

				r.versionX = (r.version !== x) ? r.version.substr(0, minorStart) : x;
				r.className = r.name + r.versionX;

				return r;
			};

		a = (/Opera|Navigator|Minefield|KHTML|Chrome|CriOS/.test(a) ? m(a, [
			[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/, ''],
			['Chrome Safari', 'Chrome'],
			['CriOS', 'Chrome'],
			['KHTML', 'Konqueror'],
			['Minefield', 'Firefox'],
			['Navigator', 'Netscape']
		]) : a).toLowerCase();

		$.browser = $.extend((!z) ? $.browser : {}, c(a,
			/(camino|chrome|crios|firefox|netscape|konqueror|lynx|msie|trident|opera|safari)/,
			[
				['trident', 'msie']
			],
			/(camino|chrome|crios|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|rv|safari)(:|\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));

		$.layout = c(a, /(gecko|konqueror|msie|trident|opera|webkit)/, [
			['konqueror', 'khtml'],
			['msie', 'trident'],
			['opera', 'presto']
		], /(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);

		$.os = {
			name: (/(win|mac|linux|sunos|solaris|iphone|ipad)/.
					exec(navigator.platform.toLowerCase()) || [u])[0].replace('sunos', 'solaris')
		};

		if (!z) {
			$('html').addClass([$.os.name, $.browser.name, $.browser.className,
				$.layout.name, $.layout.className].join(' '));
		}
	};

	$.browserTest(navigator.userAgent);
}(jQuery));
if (window.performance == undefined || window.performance.now == undefined) {
    window.performance = {}
    window.performance.now = (function() {
        return performance.now ||
            performance.mozNow ||
            performance.msNow ||
            performance.oNow ||
            performance.webkitNow ||
            function() {
                return new Date().getTime();
            };
    })();
}


if (window.performance.mark == undefined) {
    window.performance._marks = []

    window.performance.mark = function(mark_name, duration) {
        duration = duration || 0
        window.performance._marks.push({
            mark: mark_name,
            startTime: window.performance.now() - document.initTime,
            duration: duration
        })
    }

    window.performance.getEntriesByName = function(name) {
        return window.performance._marks.filter(function(mark) {
            return mark.mark == name;
        })
    }

    window.performance.clearMarks = function() {}
    window.performance.clearMeasures = function() {}

    window.performance.measure = function(new_mark, start_mark_name, end_mark_name) {
        if (typeof window.performance.getEntriesByName === 'undefined')
            return;

        var start_mark = window.performance.getEntriesByName(start_mark_name)[0]
        var end_mark = window.performance.getEntriesByName(end_mark_name)[0]
        if (typeof window.performance.mark !== 'undefined') {
            if (typeof start_mark !== 'undefined' && typeof end_mark !== 'undefined')
                window.performance.mark(new_mark, end_mark.startTime - start_mark.startTime)
            else
                window.performance.mark(new_mark, new Date().getTime() - new Date().getTime())
        }

    }

}



document.initTime = performance.now();
window.performance.mark("mark_start");

var startTime = Date.now();

var performanceManager = (function(isDebugMode) {
    var firstInit = false,
        fullInit = false;

    if (isDebugMode) $("#debug_log").show()
    else $("#debug_log").hide();

    function formatTime(totalTime) {
        if (typeof totalTime !== 'undefined' && totalTime !== null)
            return (totalTime / 1000).toFixed(3) + "s";
    }

    function calcAndWriteToLog(id) {
        $('#' + id + '>.value').html(formatTime(calcTime(id)))
    }

    function measure(id, start, end) {
        if (typeof window.performance.measure !== 'undefined')
            window.performance.measure(id, start, end);
    }

    function mark(eventName) {
        if (typeof window.performance.mark !== 'undefined')
            window.performance.mark(eventName);
    }

    function newRelic(measure) {
        if (typeof measure === 'undefined')
            return;
        var nr = typeof(newrelic) != 'undefined' ? newrelic : {
                addToTrace: function(obj) {
                    console.log(obj);                                      
                },
                setCustomAttribute: function(name, value) {
                    console.log({
                        name: name,
                        value: value
                    });
                    callToGA(measure);                                            
                }
            },
            now = Date.now();



        if (measure.name.indexOf("first_init") != -1 && !firstInit && window.performance) {
            firstInit = true;
            window.performance.measure('first_init', 'mark_start', measure.name + '_end');
            var m = window.performance.getEntriesByName('first_init')[0];
            nr.setCustomAttribute('first_init', m.duration + m.startTime);
        }
        nr.addToTrace({
            name: measure.name,
            start: startTime,
            end: startTime + measure.startTime + measure.duration,
            origin: location.origin,
            type: measure.name.split("_").slice(2).join("-")

        })
        nr.setCustomAttribute(measure.name.split("_").slice(2).join("-"), measure.duration);


        return measure;
    }

    function callToGA(measure) {
        //call to analytics
        if (window.gaUtils && window.gaUtils.gaRun && typeof measure !== 'undefined') {

            var exp = measure.name.split("_").slice(2)[0],
                eventType = measure.name.split("_").slice(2).slice(1, 3).join("-"),
                pageName = ['/vp', exp, eventType].join('/');

            
            window.gaUtils.gaRun('send',
                'timing',
                exp,
                eventType,
                measure.duration)

        }
    }

    function calcTime(eventName) {
        if (typeof window.performance.getEntriesByName === 'undefined')
            return;

        var measure = window.performance.getEntriesByName(eventName)[0];
        if (newRelic(measure))
            return measure.duration + measure.startTime;
        else
            return 'N/A';
    }

    function init(viewersArr) {
        /* //init debug box 
        var ul = document.createElement('ul');
        ul.id = 'debug_log';
        ul.style.position = "absolute";
        ul.style.bottom = "0"
        ul.style.background = "#ccc";

        for (var i = 0; i < viewersArr.length; i++) {

            var exist = !(viewersArr[i].imagesArr && viewersArr[i].src + viewersArr[i].imagesArr[0] == viewersArr[i].callbackPic);

            //first init
            var li = document.createElement('li');
            var span = document.createElement('span');
            span.innerText = exist ? 'loading...' : 'not exist';
            span.className = 'value';
            li.id = viewersArr[i].id + '_' + viewersArr[i].element.data('type') + '_first_init';
            li.innerHTML = viewersArr[i].id + '_' + viewersArr[i].element.data('type') + '_first_init : ' + span.outerHTML;
            ul.appendChild(li);

            //full init
            var li2 = document.createElement('li');
            var span = document.createElement('span');
            span.innerText = exist ? 'loading...' : 'not exist';
            span.className = 'value';
            li2.id = viewersArr[i].id + '_' + viewersArr[i].element.data('type') + '_full_init';
            li2.innerHTML = viewersArr[i].id + '_' + viewersArr[i].element.data('type') + '_full_init : ' + span.outerHTML;
            ul.appendChild(li2);
        }
        document.body.appendChild(ul);

         if (isDebugMode) $("#debug_log").show()
         else $("#debug_log").hide();
 */
    }

    return {
        Measure: measure,
        Mark: mark,
        CalcAndWriteToLog: calcAndWriteToLog,
        Init: init
    }
})(location.hash.indexOf("debug") == 1);


$(document).on("loadTemplate", function() {
    if (vm)
        performanceManager.Init(vm.getViewers());
})

$(document).on("first_init_start", function(event, data) {
    performanceManager.Mark(data.Id + "_first_init_start");

})

$(document).on("first_init_end", function(event, data) {
    performanceManager.Mark(data.Id + "_first_init_end");
    performanceManager.Measure(data.Id + "_first_init", data.Id + "_first_init_start", data.Id + "_first_init_end");
    performanceManager.CalcAndWriteToLog(data.Id + "_first_init");
})

$(document).on("full_init_start", function(event, data) {
    performanceManager.Mark(data.Id + "_full_init_start");
})

$(document).on("full_init_end", function(event, data) {
    performanceManager.Mark(data.Id + "_full_init_end");
    performanceManager.Measure(data.Id + "_full_init", data.Id + "_full_init_start", data.Id + "_full_init_end");
    performanceManager.CalcAndWriteToLog(data.Id + "_full_init");
})

if (!window.location.origin) {
  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}
var utilsManager = (function(agent){
	_agent = agent;

	function isMobile(){
		return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(_agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(_agent.substr(0, 4))
	}

	return {                
       IsMobile : isMobile  
    }
})(navigator.userAgent || navigator.vendor || window.opera);