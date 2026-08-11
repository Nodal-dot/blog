export function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

export function assertDefined<T>(value: T, message: string): NonNullable<T> {
    assert(value !== undefined && value !== null, message);
    return value;
}
