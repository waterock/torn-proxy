module.exports = (req) => {
    return Object.entries({ ...req.query, key: req.locals.key.torn_key })
        .map(([key, value]) => `${key}=${value}`);
}
