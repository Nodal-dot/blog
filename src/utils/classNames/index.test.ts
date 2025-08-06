import { classNames } from ".";

describe("classNames", () => {
    it("joins string arguments", () => {
        expect(classNames("a", "b")).toBe("a b");
    });

    it("handles numbers", () => {
        expect(classNames("a", 1)).toBe("a 1");
    });

    it("handles objects with truthy values", () => {
        expect(classNames({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });

    it("handles arrays recursively", () => {
        expect(classNames(["a", ["b", { c: true }]])).toBe("a b c");
    });

    it("handles mixed values", () => {
        expect(classNames("a", ["b", { c: true, d: false }], null)).toBe("a b c");
    });

    it("returns empty string when nothing is valid", () => {
        expect(classNames(null, undefined, false, "")).toBe("");
    });
});
