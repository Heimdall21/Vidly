

function logger (req, res, next) {
    console.log('Logging ...');
    next();
}

function authenticator (req, res, next) {
    console.log('Authenticating ...');
    next();
}

exports.logger = logger;
exports.authenticator = authenticator;