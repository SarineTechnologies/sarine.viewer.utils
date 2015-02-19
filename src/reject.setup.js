 $(function () {
    $.reject({
        reject: {
            msie:10,
            firefox:34,
            chrome:39,
            safari: 7
        }, 
        close: false, // Prevent closing of window ,
        header: 'Your browser version is out of date',
        display: ['chrome', 'safari', 'firefox', 'msie'],
        imagePath:'http://d3oayecwxm3wp6.cloudfront.net/qa2/content/viewers/shell/v1/images/'
    });
    return false;
});
