module.exports = (error) => {
    return (req, res, next) => {
        if (!req.locals.key) {
            return res.json(error);
        }
        next();
    };
};
