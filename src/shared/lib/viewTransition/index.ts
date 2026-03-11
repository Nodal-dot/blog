export function startViewTransition(update: () => void) {
    if (!document.startViewTransition) {
        update();
        return;
    }

    document.startViewTransition(() => {
        update();
    });
}