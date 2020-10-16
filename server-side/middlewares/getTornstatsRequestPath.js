const getParamsWithReplacedKey = require('../getParamsWithReplacedKey');

module.exports = (req, res, next) => {
    req.locals = {
        ...req.locals,
        proxyPath: `/api.php?${getParamsWithReplacedKey(req).join('&')}`,
    };
    next();
};
