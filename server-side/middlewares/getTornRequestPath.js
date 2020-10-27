const getParamsWithReplacedKey = require('../getParamsWithReplacedKey');

module.exports = (req, res, next) => {
    req.locals = {
        ...req.locals,
        proxyPath: `${req.path}?${getParamsWithReplacedKey(req).join('&')}`,
    };
    next();
};
