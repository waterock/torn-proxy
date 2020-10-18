const getParamsWithReplacedKey = require('../getParamsWithReplacedKey');

module.exports = (req, res, next) => {
    req.locals = {
        ...req.locals,
        proxyPath: `/${req.locals.resource}?${getParamsWithReplacedKey(req).join('&')}`,
    };
    next();
};
