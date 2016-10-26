require("../scripts/inflector");

test("conjugates \"to travel\" and returns as array with newlines", () => {
    expect(conjugate("travel")).toBe([
        "had traveled",
        "have traveled",
        "travel",
        "traveled",
        "traveling",
        "traveller",
        "travels",
        "will have traveled",
        "will travel"
    ].join("\n"));
});
