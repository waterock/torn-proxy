const publicSelections = require('../publicSelections');

module.exports = (error) => {
    function applyReplacements(replacements) {
        let message = error.proxy_error;
        for (let [placeholder, replacement] of Object.entries(replacements)) {
            message = message.replace(`{${placeholder}}`, replacement);
        }
        return { ...error, proxy_error: message };
    }

    return (req, res, next) => {
        const { key, resource, selections } = req.locals;

        if (!['*', 'public'].includes(key.permissions)) {
            return res.json(applyReplacements({
                subject: 'resource',
                details: resource,
            }));
        }

        if (key.permissions === '*') {
            return next();
        }

        if (publicSelections[resource] === undefined) {
            return res.json(applyReplacements({
                subject: 'resource',
                details: resource,
            }));
        }

        const forbiddenSelections = [];
        for (let selection of selections) {
            if (!publicSelections[resource].includes(selection)) {
                forbiddenSelections.push(selection);
            }
        }

        if (forbiddenSelections.length > 0) {
            return res.json(applyReplacements({
                subject: 'selections',
                details: forbiddenSelections.join(', '),
            }));
        }

        next();
    };
};
