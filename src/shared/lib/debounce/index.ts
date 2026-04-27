export function debounce<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): T & { cancel: () => void } {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const debounced = function (this: unknown, ...args: Parameters<T>) {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            fn.apply(this, args);
            timeout = null;
        }, delay);
    };

    debounced.cancel = () => {
        if (timeout) clearTimeout(timeout);
        timeout = null;
    };

    return debounced as T & { cancel: () => void };
}
