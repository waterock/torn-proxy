module.exports = (req, res, next) => {
    const paramsArray = Object.entries({
        ...req.query,
        key: req.locals.key.torn_key,
    }).map(([key, value]) => `${key}=${value}`);

    req.locals = {
        ...req.locals,
        proxyPath: `/${req.locals.resource}?${paramsArray.join('&')}`,
    };

    next();
};
