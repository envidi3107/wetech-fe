import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./ImageLightbox.module.css";

const TRANSITION_DURATION = 320;

export const getImageOrigin = (image) => {
    if (!image) return null;

    const rect = image.getBoundingClientRect();

    return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
    };
};

const ImageLightbox = ({ src, alt = "Ảnh xem toàn màn hình", origin, onClose }) => {
    const closeButtonRef = useRef(null);
    const closeTimerRef = useRef(null);
    const onCloseRef = useRef(onClose);
    const closingRef = useRef(false);
    const [isClosing, setIsClosing] = useState(false);

    onCloseRef.current = onClose;

    const requestClose = useCallback(() => {
        if (closingRef.current) return;

        closingRef.current = true;
        setIsClosing(true);

        const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        closeTimerRef.current = window.setTimeout(
            () => onCloseRef.current(),
            prefersReducedMotion ? 0 : TRANSITION_DURATION,
        );
    }, []);

    const imageStyle = useMemo(() => {
        const totalPadding = window.innerWidth <= 600 ? 24 : 48;
        const availableWidth = Math.max(window.innerWidth - totalPadding, 1);
        const availableHeight = Math.max(window.innerHeight - totalPadding, 1);
        const sourceWidth = origin?.naturalWidth || origin?.width || availableWidth;
        const sourceHeight = origin?.naturalHeight || origin?.height || availableHeight;
        const sourceRatio = sourceWidth / sourceHeight;
        const availableRatio = availableWidth / availableHeight;
        const targetWidth = availableRatio > sourceRatio ? availableHeight * sourceRatio : availableWidth;
        const targetHeight = availableRatio > sourceRatio ? availableHeight : availableWidth / sourceRatio;
        const startX = origin ? origin.left + origin.width / 2 - window.innerWidth / 2 : 0;
        const startY = origin ? origin.top + origin.height / 2 - window.innerHeight / 2 : 0;

        return {
            width: `${targetWidth}px`,
            height: `${targetHeight}px`,
            "--start-x": `${startX}px`,
            "--start-y": `${startY}px`,
            "--start-scale-x": origin ? Math.max(origin.width / targetWidth, 0.01) : 0.92,
            "--start-scale-y": origin ? Math.max(origin.height / targetHeight, 0.01) : 0.92,
        };
    }, [origin]);

    useEffect(() => {
        if (!src) return undefined;

        const previousActiveElement = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                requestClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            window.clearTimeout(closeTimerRef.current);
            document.body.style.overflow = previousOverflow;
            previousActiveElement?.focus?.();
        };
    }, [requestClose, src]);

    if (!src) return null;

    return createPortal(
        <div
            className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={`Xem toàn màn hình: ${alt}`}
            onClick={(event) => {
                event.stopPropagation();
                if (event.target === event.currentTarget) requestClose();
            }}
        >
            <button
                ref={closeButtonRef}
                type="button"
                className={styles.closeButton}
                onClick={requestClose}
                aria-label="Đóng ảnh toàn màn hình"
            >
                ×
            </button>
            <img
                className={`${styles.image} ${isClosing ? styles.imageClosing : ""}`}
                style={imageStyle}
                src={src}
                alt={alt}
                onClick={(event) => event.stopPropagation()}
            />
        </div>,
        document.body,
    );
};

export default ImageLightbox;
