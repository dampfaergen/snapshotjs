var page = new WebPage(),
	address;

page.settings.userAgent = 'Googlebot';
page.settings.loadImages = true;
page.settings.localToRemoteUrlAccessEnabled = true;

if (phantom.args.length === 0) {
    console.log('Usage: snapshot.js <some URL>');
    phantom.exit();
} else {
    address = phantom.args[0];
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
        } else {
            console.log(page.content);
        }
        phantom.exit();
    });
}
