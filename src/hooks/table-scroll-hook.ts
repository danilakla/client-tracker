import { useCallback, useEffect, useRef, useState } from "react";

export const useTableScroll = (classesIds: any) => {
    const [isVerticalScrollNeeded, setIsVerticalScrollNeeded] = useState(true);
    const [isHorizontalScrollNeeded, setIsHorizontalScrollNeeded] = useState(true);

    const verticalScrollRef = useRef<HTMLDivElement | null>(null);
    const horizontalScrollRef1 = useRef<HTMLDivElement | null>(null);
    const horizontalScrollRef2 = useRef<HTMLDivElement | null>(null);

    const verticalTrackRef = useRef<HTMLDivElement | null>(null);
    const verticalSliderRef = useRef<HTMLDivElement | null>(null);

    const horizontalTrackRef = useRef<HTMLDivElement | null>(null);
    const horizontalSliderRef = useRef<HTMLDivElement | null>(null);

    const isVerticalDraggingRef = useRef(false);
    const isHorizontalDraggingRef = useRef(false);

    const startVerticalYRef = useRef(0);
    const startVerticalSliderTopRef = useRef(0);

    const startHorizontalXRef = useRef(0);
    const startHorizontalSliderLeftRef = useRef(0);

    const syncInProgressRef = useRef(false);
    const rafIdRef = useRef<number | null>(null);

    const updateVerticalSliderSize = useCallback(() => {
        const container = verticalScrollRef.current;
        const slider = verticalSliderRef.current;
        const track = verticalTrackRef.current;

        if (!container || !slider || !track) {
            setIsVerticalScrollNeeded(false);
            return;
        }

        const visibleRatio = container.clientHeight / container.scrollHeight;
        setIsVerticalScrollNeeded(visibleRatio < 1);
        const sliderHeight = Math.max(visibleRatio * track.clientHeight, 30);

        slider.style.height = `${sliderHeight}px`;
    }, []);

    const updateVerticalSliderPosition = useCallback(() => {
        const container = verticalScrollRef.current;
        const slider = verticalSliderRef.current;
        const track = verticalTrackRef.current;

        if (!container || !slider || !track) return;

        const scrollableHeight = container.scrollHeight - container.clientHeight;
        const trackHeight = track.clientHeight - slider.offsetHeight;

        const scrollTop = container.scrollTop;
        const sliderTop = (scrollTop / scrollableHeight) * trackHeight;

        slider.style.top = `${sliderTop}px`;
    }, []);

    const handleVerticalMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isVerticalDraggingRef.current) return;

        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - startVerticalYRef.current;

        const container = verticalScrollRef.current;
        const slider = verticalSliderRef.current;
        const track = verticalTrackRef.current;

        if (!container || !slider || !track) return;

        const trackHeight = track.clientHeight - slider.offsetHeight;
        const scrollableHeight = container.scrollHeight - container.clientHeight;

        let newSliderTop = startVerticalSliderTopRef.current + deltaY;
        newSliderTop = Math.max(0, Math.min(newSliderTop, trackHeight));

        slider.style.top = `${newSliderTop}px`;
        container.scrollTop = (newSliderTop / trackHeight) * scrollableHeight;
    }, []);

    const handleVerticalEnd = useCallback(() => {
        isVerticalDraggingRef.current = false;
        document.removeEventListener("mousemove", handleVerticalMove);
        document.removeEventListener("mouseup", handleVerticalEnd);
        document.removeEventListener("touchmove", handleVerticalMove);
        document.removeEventListener("touchend", handleVerticalEnd);
    }, [handleVerticalMove]);

    const handleVerticalStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        updateVerticalSliderSize();
        updateVerticalSliderPosition();

        isVerticalDraggingRef.current = true;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        startVerticalYRef.current = clientY;

        const slider = verticalSliderRef.current;
        if (slider) {
            startVerticalSliderTopRef.current = parseInt(slider.style.top || "0", 10);
        }

        document.addEventListener("mousemove", handleVerticalMove);
        document.addEventListener("mouseup", handleVerticalEnd);
        document.addEventListener("touchmove", handleVerticalMove);
        document.addEventListener("touchend", handleVerticalEnd);
    }, [updateVerticalSliderSize, updateVerticalSliderPosition, handleVerticalMove, handleVerticalEnd]);

    const updateHorizontalSliderSize = useCallback(() => {
        const container = horizontalScrollRef1.current;
        const slider = horizontalSliderRef.current;
        const track = horizontalTrackRef.current;

        if (!container || !slider || !track) {
            setIsHorizontalScrollNeeded(false);
            return;
        }

        const visibleRatio = container.clientWidth / container.scrollWidth;
        setIsHorizontalScrollNeeded(visibleRatio < 1);
        const sliderWidth = Math.max(visibleRatio * track.clientWidth, 30);

        slider.style.width = `${sliderWidth}px`;
    }, []);

    const updateHorizontalSliderPosition = useCallback(() => {
        const container = horizontalScrollRef1.current;
        const slider = horizontalSliderRef.current;
        const track = horizontalTrackRef.current;

        if (!container || !slider || !track) return;

        const scrollableWidth = container.scrollWidth - container.clientWidth;
        const trackWidth = track.clientWidth - slider.offsetWidth;

        const scrollLeft = container.scrollLeft;
        const sliderLeft = (scrollLeft / scrollableWidth) * trackWidth;

        slider.style.left = `${sliderLeft}px`;
    }, []);

    const syncScrollPositions = useCallback((scrollLeft: number) => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = requestAnimationFrame(() => {
            syncInProgressRef.current = true;
            
            const containers = [
                horizontalScrollRef1.current,
                horizontalScrollRef2.current
            ].filter(Boolean) as HTMLDivElement[];

            containers.forEach(container => {
                if (Math.abs(container.scrollLeft - scrollLeft) > 1) {
                    container.scrollLeft = scrollLeft;
                }
            });

            updateHorizontalSliderPosition();
            syncInProgressRef.current = false;
        });
    }, [updateHorizontalSliderPosition]);

    const handleHorizontalScroll = useCallback((e: Event) => {
        if (syncInProgressRef.current) return;
        
        const target = e.target as HTMLDivElement;
        const scrollLeft = target.scrollLeft;
        
        syncScrollPositions(scrollLeft);
    }, [syncScrollPositions]);

    const handleHorizontalMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isHorizontalDraggingRef.current) return;

        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const deltaX = clientX - startHorizontalXRef.current;

        const container = horizontalScrollRef1.current;
        const slider = horizontalSliderRef.current;
        const track = horizontalTrackRef.current;

        if (!container || !slider || !track) return;

        const trackWidth = track.clientWidth - slider.offsetWidth;
        const scrollableWidth = container.scrollWidth - container.clientWidth;

        let newSliderLeft = startHorizontalSliderLeftRef.current + deltaX;
        newSliderLeft = Math.max(0, Math.min(newSliderLeft, trackWidth));

        slider.style.left = `${newSliderLeft}px`;
        
        const newScrollLeft = (newSliderLeft / trackWidth) * scrollableWidth;
        syncScrollPositions(newScrollLeft);
    }, [syncScrollPositions]);

    const handleHorizontalEnd = useCallback(() => {
        isHorizontalDraggingRef.current = false;
        document.removeEventListener("mousemove", handleHorizontalMove);
        document.removeEventListener("mouseup", handleHorizontalEnd);
        document.removeEventListener("touchmove", handleHorizontalMove);
        document.removeEventListener("touchend", handleHorizontalEnd);
    }, [handleHorizontalMove]);

    const handleHorizontalStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        updateHorizontalSliderSize();
        updateHorizontalSliderPosition();

        isHorizontalDraggingRef.current = true;
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        startHorizontalXRef.current = clientX;

        const slider = horizontalSliderRef.current;
        if (slider) {
            startHorizontalSliderLeftRef.current = parseInt(slider.style.left || "0", 10);
        }

        document.addEventListener("mousemove", handleHorizontalMove);
        document.addEventListener("mouseup", handleHorizontalEnd);
        document.addEventListener("touchmove", handleHorizontalMove);
        document.addEventListener("touchend", handleHorizontalEnd);
    }, [updateHorizontalSliderSize, updateHorizontalSliderPosition, handleHorizontalMove, handleHorizontalEnd]);

    useEffect(() => {
        updateVerticalSliderSize();
        updateVerticalSliderPosition();

        const container = verticalScrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateVerticalSliderPosition);
        }

        const resizeHandler = () => {
            updateVerticalSliderSize();
            updateHorizontalSliderSize();
        };

        window.addEventListener("resize", resizeHandler);

        return () => {
            container?.removeEventListener("scroll", updateVerticalSliderPosition);
            window.removeEventListener("resize", resizeHandler);
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [updateVerticalSliderSize, updateVerticalSliderPosition, updateHorizontalSliderSize]);

    useEffect(() => {
        const containers = [
            horizontalScrollRef1.current,
            horizontalScrollRef2.current
        ].filter(Boolean) as HTMLDivElement[];

        containers.forEach(container => {
            container.addEventListener("scroll", handleHorizontalScroll);
        });

        return () => {
            containers.forEach(container => {
                container.removeEventListener("scroll", handleHorizontalScroll);
            });
        };
    }, [handleHorizontalScroll]);

    useEffect(() => {
        updateHorizontalSliderSize();
        updateHorizontalSliderPosition();
    }, [classesIds, updateHorizontalSliderSize, updateHorizontalSliderPosition]);

    return {
        verticalScrollRef,
        horizontalScrollRef1,
        horizontalScrollRef2,
        verticalTrackRef,
        verticalSliderRef,
        horizontalTrackRef,
        horizontalSliderRef,
        handleVerticalStart,
        handleHorizontalStart,
        isVerticalScrollNeeded,
        isHorizontalScrollNeeded,
    };
};