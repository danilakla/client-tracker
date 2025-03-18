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

  const isSyncingScroll = useRef(false);

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

    const newScrollTop = (newSliderTop / trackHeight) * scrollableHeight;
    container.scrollTop = newScrollTop;
  }, []);

  const handleVerticalEnd = useCallback(() => {
    isVerticalDraggingRef.current = false;
    document.removeEventListener("mousemove", handleVerticalMove);
    document.removeEventListener("mouseup", handleVerticalEnd);
    document.removeEventListener("touchmove", handleVerticalMove);
    document.removeEventListener("touchend", handleVerticalEnd);
  }, [handleVerticalMove]);

  const handleVerticalStart = useCallback((e: React.MouseEvent | React.TouchEvent<HTMLDivElement>) => {
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

  const updateHorizontalSliderPosition = useCallback(() => {
    const container = horizontalScrollRef1.current;
    const slider = horizontalSliderRef.current;
    const track = horizontalTrackRef.current;

    if (!container || !slider || !track) return;

    const scrollableWidth = container.scrollWidth - container.clientWidth;
    if (scrollableWidth <= 0) return;

    const trackWidth = track.clientWidth - slider.offsetWidth;
    const scrollLeft = container.scrollLeft;
    const sliderLeft = (scrollLeft / scrollableWidth) * trackWidth;

    slider.style.left = `${sliderLeft}px`;
  }, []);

  const syncScrollPositions = useCallback((source: HTMLElement, target: HTMLElement) => {
    if (isSyncingScroll.current || !target) return;
    isSyncingScroll.current = true;
    
    const scrollLeft = source.scrollLeft;
    target.scrollLeft = scrollLeft;
    
    requestAnimationFrame(() => {
      updateHorizontalSliderPosition();
      isSyncingScroll.current = false;
    });
  }, [updateHorizontalSliderPosition]);


  const handleHorizontalScroll = useCallback((e: Event) => {
    const source = e.target as HTMLElement;
    requestAnimationFrame(() => {
      if (source === horizontalScrollRef1.current) {
        syncScrollPositions(source, horizontalScrollRef2.current!);
      } else {
        syncScrollPositions(source, horizontalScrollRef1.current!);
      }
    });
  }, [syncScrollPositions]);

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

  const handleHorizontalMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isHorizontalDraggingRef.current) return;
    e.preventDefault();

    requestAnimationFrame(() => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - startHorizontalXRef.current;
      
      const container = horizontalScrollRef1.current;
      const slider = horizontalSliderRef.current;
      const track = horizontalTrackRef.current;

      if (!container || !slider || !track) return;

      const trackWidth = track.clientWidth - slider.offsetWidth;
      const scrollableWidth = container.scrollWidth - container.clientWidth;

      let newSliderLeft = Math.max(
        0, 
        Math.min(startHorizontalSliderLeftRef.current + deltaX, trackWidth)
      );

      slider.style.transform = `translateX(${newSliderLeft}px)`;
      container.scrollLeft = (newSliderLeft / trackWidth) * scrollableWidth;
    });
  }, []);

  const handleHorizontalEnd = useCallback(() => {
    isHorizontalDraggingRef.current = false;
    document.removeEventListener("mousemove", handleHorizontalMove);
    document.removeEventListener("mouseup", handleHorizontalEnd);
    document.removeEventListener("touchmove", handleHorizontalMove);
    document.removeEventListener("touchend", handleHorizontalEnd);
  }, [handleHorizontalMove]);

  const handleHorizontalStart = useCallback((e: React.MouseEvent | React.TouchEvent<HTMLDivElement>) => {
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
    const hContainer1 = horizontalScrollRef1.current;
    const hContainer2 = horizontalScrollRef2.current;
    
    const handler = (e: Event) => handleHorizontalScroll(e);
    
    const options = { passive: true, capture: true };
    
    if (hContainer1) hContainer1.addEventListener('scroll', handler, options);
    if (hContainer2) hContainer2.addEventListener('scroll', handler, options);

    return () => {
      if (hContainer1) hContainer1.removeEventListener('scroll', handler);
      if (hContainer2) hContainer2.removeEventListener('scroll', handler);
    };
  }, [handleHorizontalScroll]);


  useEffect(() => {
    updateVerticalSliderSize();
    updateVerticalSliderPosition();
    const container = verticalScrollRef.current;

    const resizeHandler = () => {
      updateVerticalSliderSize();
      updateVerticalSliderPosition();
      updateHorizontalSliderSize();
      updateHorizontalSliderPosition();
    };

    window.addEventListener("resize", resizeHandler);
    if (container) container.addEventListener("scroll", updateVerticalSliderPosition);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      if (container) container.removeEventListener("scroll", updateVerticalSliderPosition);
    };
  }, [updateVerticalSliderSize, updateVerticalSliderPosition, updateHorizontalSliderSize, updateHorizontalSliderPosition]);

  useEffect(() => {
    updateHorizontalSliderSize();
    updateHorizontalSliderPosition();
  }, [classesIds, updateHorizontalSliderSize, updateHorizontalSliderPosition]);

  return {
    isHorizontalScrollNeeded,
    isVerticalScrollNeeded,
    verticalTrackRef,
    verticalScrollRef,
    verticalSliderRef,
    horizontalTrackRef,
    horizontalSliderRef,
    horizontalScrollRef1,
    horizontalScrollRef2,
    handleHorizontalStart,
    handleVerticalStart,
  };
};
