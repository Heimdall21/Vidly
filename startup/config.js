const config = require('config');

module.exports = function() {
    if (!config.get('jwtPrivateKey')) {
        //console.error('FATAL ERROR: jwtPrivateKey is not defined.');
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
        // this is one of the global objects in node
        //process.exit(1);
    }

        // Configuration
    console.log('Application Name: ' + config.get('name'));
    console.log('Mail Server: ' + config.get('mail.host'));
    //console.log('Mail Password: ' + config.get('mail.password'));
}