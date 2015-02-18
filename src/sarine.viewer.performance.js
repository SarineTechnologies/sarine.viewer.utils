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
        var start_mark = window.performance.getEntriesByName(start_mark_name)[0]
        var end_mark = window.performance.getEntriesByName(end_mark_name)[0]
        if(typeof start_mark !== 'undefined' && typeof end_mark !== 'undefined')
            window.performance.mark(new_mark, end_mark.startTime - start_mark.startTime)
        else
            window.performance.mark(new_mark,new Date().getTime() - new Date().getTime())
    }
}

document.initTime = performance.now();
window.performance.mark("mark_start")



var performanceManager = (function(isDebugMode){
    
    function formatTime(totalTime){
        return (totalTime / 1000).toFixed(3) + "s";
    }
    
    function calcAndWriteToLog(id){
    $('#' + id + '>.value').html(performanceManager.FormatTime(calcTime(id)))
    }    

    function measure(id){    
        window.performance.measure(id);    
    }

    function mark(eventName){
        window.performance.measure(eventName);
    }

    function calcTime(eventName){
        var measure = window.performance.getEntriesByName(eventName)[0];
        if(typeof measure !== 'undefined')
            return measure.duration + measure.startTime;
        else
            return 'N/A';
    }

    function init(viewersArr){           
         var ul = document.createElement('ul');
         ul.id = 'debug_log';
         ul.style.position = "absolute";
         ul.style.bottom ="0"
         ul.style.background = "#ccc"
         
         for (var i=0; i < viewersArr.length; i++){

            //first init
            var li= document.createElement('li');
            var span = document.createElement('span');
            span.innerText = 'loading...';
            span.className = 'value';
            li.id = viewersArr[i].id + '_' + viewersArr[i].element.data('type') + '_first_init';
            li.innerHTML = viewersArr[i].id + '_' + viewersArr[i].element.data('type') +  '_first_init : ' + span.outerHTML;
            ul.appendChild(li);       

            //full init
            var li2= document.createElement('li');
            var span = document.createElement('span');
            span.innerText = 'loading...';
            span.className = 'value';
            li2.id = viewersArr[i].id + '_' + viewersArr[i].element.data('type') + '_full_init';
            li2.innerHTML = viewersArr[i].id + '_' + viewersArr[i].element.data('type') +  '_full_init : ' + span.outerHTML;
            ul.appendChild(li2);
         }
         document.body.appendChild(ul);

        if(isDebugMode)
            $("#debug_log").show();
        else
            $("#debug_log").hide();

    }

    return {                
        Measure : measure,
        Mark : mark,
        CalcAndWriteToLog : calcAndWriteToLog,        
        Init : init
    }
})(location.hash.indexOf("debug") == 1);



    $(document).on("loadTemplate",function(){                
        performanceManager.Init(vm.getViewers());      
    })
	
	$(document).on("first_init_start",function(event, data){  			
       performanceManager.Measure(data.Id + "_first_init") 
       performanceManager.Mark(data.Id + "_first_init_start")
    })

    $(document).on("first_init_end",function(event, data){            
       performanceManager.Mark(data.Id + "_first_init_end")                
       performanceManager.CalcAndWriteToLog(data.Id + "_first_init")
    })

    $(document).on("full_init_start",function(event, data){            
       performanceManager.Measure(data.Id + "_full_init") 
       performanceManager.Mark(data.Id + "_full_init_start")
    })

    $(document).on("full_init_end",function(event, data){            
       performanceManager.Mark(data.Id + "_full_init_end")                
       performanceManager.CalcAndWriteToLog(data.Id + "_full_init")
    })



   

