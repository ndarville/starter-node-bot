const nlp = require("nlp_compromise");

conjugate = function(infinitive) {
    var dict = nlp.verb(infinitive).conjugate();

    // Slack trims the trailing newline
    response = Object.keys(dict).map(function(key) {
        return dict[key];
    }).sort().join("\n");

    return response;
};
