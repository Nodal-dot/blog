import React from "react";

export const useModal = () => {
    const [open, setOpen] = React.useState(false);

    const openModal = () => setOpen(true);
    const closeModal = () => setOpen(false);
    const toggleModal = () => setOpen((p) => !p);

    return { open, openModal, closeModal, toggleModal };
};
