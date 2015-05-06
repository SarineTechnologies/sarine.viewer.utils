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