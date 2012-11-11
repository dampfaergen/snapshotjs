var page = new WebPage(),
    t, address;

page.settings.userAgent = 'Googlebot';
page.settings.loadImages = false;
page.settings.loadPlugins = true;

// add cookie to disable welcome message on homescreen
phantom.addCookie({
    'name': 'welcomeDismissed',
    'value': 'true',
    'domain': '.kobstaden.dk'
});

phantom.addCookie({
    'name': 'welcomeDismissed',
    'value': 'true',
    'domain': 'www.kobstaden.dk'
});

var cookies = [{
    'name': 'welcomeDismissed',
    'value': 'true'
}];
page.setCookies(cookies);
phantom.setCookies(cookies);

if (phantom.args.length === 0) {
    console.log('Usage: snapshot.js <some URL>');
    phantom.exit();
} else {
    t = Date.now();
    address = phantom.args[0];
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
        } else {
            // t = Date.now() - t;
            // console.log('Page title is ' + page.evaluate(function () {
            //     return document.title;
            // }));
            // console.log('Loading time ' + t + ' msec');
            console.log(page.content);
        }
        phantom.exit();
    });
}
