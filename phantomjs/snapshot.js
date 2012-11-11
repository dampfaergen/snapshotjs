var page = new WebPage(),
    t, address;

page.settings.userAgent = 'Googlebot';
page.settings.loadImages = true;
page.settings.localToRemoteUrlAccessEnabled = true;

// add cookie to disable welcome message on homescreen
phantom.addCookie({
    'name': 'welcomeToBeta',
    'value': 'true',
    'domain': 'www.kobstaden.dk'
});

phantom.addCookie({
    'name': 'welcomeToBeta',
    'value': 'true',
    'domain': 'snapshot.kobstaden.dk'
});

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
