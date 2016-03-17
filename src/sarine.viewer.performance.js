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
            name : mark_name,
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
        var time = formatTime(calcTime(id));
        $('#' + id + '>.value').html(time);        
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
        if (!validateMeasure(measure))
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
                }
            },
            now = Date.now();



        if (window.performance && validateMeasure(measure) && measure.name.indexOf("first_init") != -1 && !firstInit) {
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
        if (window.gaUtils && window.gaUtils.gaRun && validateMeasure(measure)) {

            var exp = measure.name.split("_").slice(2)[0],
                eventType = measure.name.split("_").slice(2).slice(1, 3).join("-"),
                pageName = ['/vp', exp, eventType].join('/');

            
            window.gaUtils.gaRun('send',
                'timing',
                exp,
                eventType,
                Math.round(measure.duration))  

        }
    }

    function callToGaFel(measure){
        //call to analytics
        if (window.gaUtils && window.gaUtils.gaRun && typeof document.fel !== 'undefined' &&
             validateMeasure(measure) && measure.name.indexOf('experience') !== -1) {

            var timingCategory = measure.name.split('-')[0],
                arr = measure.name.split('-'),
                arrTemp = arr.shift(),
                timingVar = arr.join('-'),                
                timingValue = Math.round(measure.duration),
                stoneCahce = getFromLocalStorage('stones', document.fel.stone),
                templateCahce = getFromLocalStorage('templates', document.fel.template),
                timingLabel = stoneCahce + "/" + templateCahce;

            if(location.hash.indexOf("debug") === 1)
                console.log('GA : ' + 'timingCategory: ' + timingCategory +', timingVar: ' + timingVar + ', timingValue: '+  timingValue + ', timingLabel: '  +timingLabel)
              
            window.gaUtils.gaRun('send',
                'timing',
                timingCategory,
                timingVar,
                timingValue,
                timingLabel);  

            if(timingVar === "last-experience-completed"){
                addToLocalStorage('stones', document.fel.stone);
                addToLocalStorage('templates', document.fel.template);    
            }
            
        }
    }

    function validateMeasure(measure){
        return typeof measure !== 'undefined' && 
         typeof measure.name !== 'undefined' && 
         typeof measure.duration !== 'undefined';
    }

    function getFromLocalStorage(type, value){
        var storedStr = null,
            storedArr = null,
            typeVal = type.substring(0, type.length -1),
            res = "";

       if (typeof Storage !== "undefined") {
        if (localStorage.getItem(type) !== null) {
           storedStr = localStorage.getItem(type);
          if(storedStr != null){
            storedArr = JSON.parse(storedStr);
          }
          if(storedArr.indexOf(value) !== -1)
            res = typeVal + "-cached";
        }
      }

      return res;
    }

    function addToLocalStorage (type, value) {
      var stored;
      if (typeof Storage !== "undefined") {
        if (localStorage.getItem(type) !== null) {
          stored = JSON.parse(localStorage.getItem(type));
          if (stored.indexOf(value) === -1) {
            stored.push(value);
            return localStorage.setItem(type, JSON.stringify(stored));
          }
        }
      }
    }

    function calcTime(eventName) {
        if (typeof window.performance.getEntriesByName === 'undefined')
            return;

        var measure = window.performance.getEntriesByName(eventName)[0];
        //if (newRelic(measure))
        if (measure.duration && measure.startTime){            
            callToGA(measure); 
            callToGaFel(measure);
            if (newRelic(measure))
                return measure.duration + measure.startTime;
            else
                return 'N/A';
        }            
        
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
    //fel event
    var curExp = data.Id.split('_').slice(2)[0];
    if(curExp === document.fel.firstExp){
        performanceManager.Mark(curExp + "-first-init-end");             
        performanceManager.Measure(curExp + "-first-experience-preview", "FEL-start", curExp + "-first-init-end");
        performanceManager.CalcAndWriteToLog(curExp + "-first-experience-preview");
    }
    if(curExp === document.fel.lastExp){
        performanceManager.Mark(curExp + "-first-init-end");             
        performanceManager.Measure(curExp + "-last-experience-preview", "FEL-start", curExp + "-first-init-end");
        performanceManager.CalcAndWriteToLog(curExp + "-last-experience-preview");
    }
    
    
    //atom event
    performanceManager.Mark(data.Id + "_first_init_end");
    performanceManager.Measure(data.Id + "_first_init", data.Id + "_first_init_start", data.Id + "_first_init_end");
    performanceManager.CalcAndWriteToLog(data.Id + "_first_init");
})

$(document).on("full_init_start", function(event, data) {
    performanceManager.Mark(data.Id + "_full_init_start");
})

$(document).on("full_init_end", function(event, data) {
    //fel event
    var curExp = data.Id.split('_').slice(2)[0];
    if(curExp === document.fel.firstExp){
        performanceManager.Mark(curExp + "-full-init-end");            
        performanceManager.Measure(curExp + "-first-experience-completed", "FEL-start", curExp + "-full-init-end");
        performanceManager.CalcAndWriteToLog(curExp + "-first-experience-completed");
    }

    if(curExp === document.fel.lastExp){
        performanceManager.Mark(curExp + "-full-init-end");             
        performanceManager.Measure(curExp + "-last-experience-completed", "FEL-start", curExp + "-full-init-end");
        performanceManager.CalcAndWriteToLog(curExp + "-last-experience-completed");
    }

    performanceManager.Mark(data.Id + "_full_init_end");
    performanceManager.Measure(data.Id + "_full_init", data.Id + "_full_init_start", data.Id + "_full_init_end");
    performanceManager.CalcAndWriteToLog(data.Id + "_full_init");
})


/*$(document).on("FEL-start", function(event, data) {
    performanceManager.Mark(document.fel.exp + "-FEL-start");
})*/
