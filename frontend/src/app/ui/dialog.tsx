// components/dialog.tsx

'use client';

import { useState, useEffect, JSX } from 'react';
import { createPortal } from 'react-dom';

type DialogProps = {
    isOpen: boolean;
    onClose?: () => void;
    children: JSX.Element[] | JSX.Element; // Allow array of children or single child
};

export function Dialog({
    isOpen,
    onClose,
    children,
}: DialogProps): JSX.Element | null {

    const [isMounted, setIsMounted] = useState(false); // Flag to check if DOM node exists

    useEffect(() => {
        setIsMounted(true); // Initialize flag when component mounts

        return () => {
            setIsMounted(false); // Reset flag when unmounting 
        };

    }, []);


    useEffect(() => {
        function handleClose(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose?.(); // Call onClose callback if defined

            }

        }
        document.addEventListener('keydown', handleClose);
        return () => {
            document.removeEventListener('keydown', handleClose);

        };

    }, [onClose]);

    if (!isMounted || !isOpen) return null;

    const container = document.getElementById('modal-root')!
    const d = <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-gray-900 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-3 w-full max-w-md">
            {children}
        </div>
    </div>
    return createPortal(d, container);

};
