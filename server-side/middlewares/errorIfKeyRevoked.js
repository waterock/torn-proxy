module.exports = (error) => {
    return (req, res, next) => {
        if (req.locals.key.is_revoked) {
            return res.json(error);
        }
        next();
    };
};
