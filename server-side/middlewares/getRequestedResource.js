module.exports = (req, res, next) => {
    req.locals = {
        ...req.locals,
        resource: req.path.substr(1).split('/')[0],
    };
    next();
};
