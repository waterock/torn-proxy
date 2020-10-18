module.exports = (req, res, next) => {
    const requestedSelections = typeof req.query.selections === 'string'
        ? req.query.selections.split(',')
        : [''];

    req.locals = {
        ...req.locals,
        selections: requestedSelections,
    };

    next();
};
