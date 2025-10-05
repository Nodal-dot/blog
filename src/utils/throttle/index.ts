export function throttle<T extends (...args: unknown[]) => void>(
    fn: T,
    delay: number
): T & { cancel: () => void } {
    let lastCall = 0;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const throttled = function (this: unknown, ...args: Parameters<T>) {
        const now = Date.now();

        if (now - lastCall >= delay) {
            lastCall = now;
            fn.apply(this, args);
        } else {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(
                () => {
                    lastCall = Date.now();
                    fn.apply(this, args);
                },
                delay - (now - lastCall)
            );
        }
    };

    throttled.cancel = () => {
        if (timeout) clearTimeout(timeout);
    };

    return throttled as T & { cancel: () => void };
}
