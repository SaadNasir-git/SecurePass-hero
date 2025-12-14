"use client";

import React, { useState, useRef, useEffect, SetStateAction } from "react";
import { Pen } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface DragStart {
  x: number;
  y: number;
}

interface BarProps {
  setshowpopup: React.Dispatch<SetStateAction<boolean>>;
}

const Bar = ({ setshowpopup }: BarProps) => {
    const [clicked, setclicked] = useState(false);
    const [position, setPosition] = useState<Position>({ x: 0, y: 200 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<DragStart>({ x: 0, y: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const [scrollbarWidth, setScrollbarWidth] = useState(0);
    const barRef = useRef<HTMLDivElement>(null);

    // Initialize and handle scrollbar changes
    useEffect(() => {
        setIsMounted(true);

        const updateScrollbar = () => {
            const sbWidth = window.innerWidth - document.documentElement.clientWidth;
            setScrollbarWidth(sbWidth);

            // Set default position to right side with scrollbar adjustment
            setPosition({
                x: document.documentElement.clientWidth - 48 + sbWidth,
                y: 200
            });
        };

        updateScrollbar();

        const resizeObserver = new ResizeObserver(updateScrollbar);
        resizeObserver.observe(document.body);

        return () => resizeObserver.disconnect();
    }, []);

    const handleStart = (clientX: number, clientY: number) => {
        setIsDragging(true);
        setDragStart({
            x: clientX,
            y: clientY
        });
        document.body.style.cursor = 'pointer';
        document.body.style.userSelect = 'none';
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging || !isMounted) return;

        const dx = clientX - dragStart.x;
        const dy = clientY - dragStart.y;

        setPosition(prev => {
            const barWidth = barRef.current?.offsetWidth || 48;
            const barHeight = barRef.current?.offsetHeight || 40;

            // Calculate available space
            const maxX = document.documentElement.clientWidth - barWidth +
                (prev.x > document.documentElement.clientWidth / 2 ? scrollbarWidth : 0);
            const maxY = document.documentElement.clientHeight - barHeight;

            const newX = Math.max(0, Math.min(maxX, prev.x + dx));
            const newY = Math.max(0, Math.min(maxY, prev.y - dy));

            return { x: newX, y: newY };
        });

        setDragStart({ x: clientX, y: clientY });
    };

    const handleEnd = () => {
        if (!isDragging || !isMounted) return;

        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        const barWidth = barRef.current?.offsetWidth || 48;
        const viewportWidth = document.documentElement.clientWidth;

        // Snap to nearest side with scrollbar adjustment
        const shouldSnapLeft = position.x < viewportWidth / 2;

        setPosition({
            x: shouldSnapLeft ? 0 : viewportWidth - barWidth + scrollbarWidth,
            y: position.y
        });
    };

    // Mouse event handlers
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        handleMove(e.clientX, e.clientY);
    };

    // Touch event handlers
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    };

    useEffect(() => {
        if (!isMounted) return;

        const barElement = barRef.current;
        if (!barElement) return;

        if (isDragging) {
            // Add both mouse and touch events
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchend', handleEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleTouchMove as EventListener);
            document.removeEventListener('mouseup', handleEnd);
            document.removeEventListener('touchend', handleEnd);
        };
    }, [isDragging, dragStart, isMounted]);

    const isOnLeftSide = isMounted && position.x < document.documentElement.clientWidth / 2;

    if (!isMounted) {
        return <div className="fixed right-0 bottom-40 w-12 h-12" />;
    }

    return (
        <div
            ref={barRef}
            className="fixed z-[1000] touch-none" // Added touch-none for better mobile handling
            style={{
                [isOnLeftSide ? 'left' : 'right']: isOnLeftSide
                    ? `${position.x}px`
                    : `${Math.max(0, window.innerWidth - position.x - 48)}px`,
                bottom: `${position.y}px`,
                cursor: isDragging ? 'grabbing' : 'pointer',
                transition: isDragging ? 'none' : 'all 0.2s ease-out',
            } as React.CSSProperties}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <div
                title="Change the encryption password"
                className={`bg-gray-300 relative w-12 rounded-lg overflow-hidden transition-all flex ${isOnLeftSide ? (clicked ? "-left-0" : "-left-8") : (clicked ? "-right-0" : "-right-8")
                    } ${isOnLeftSide
                        ? 'border-l-0 border-r-2 border-gray-400'
                        : 'border-r-0 border-l-2 border-gray-400'
                    }`}
            >
                <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        clicked ? setclicked(false) : setclicked(true);
                        e.stopPropagation();
                    }}
                    className={`px-2 cursor-pointer bg-gray-400 hover:bg-gray-500 transition-colors ${isOnLeftSide ? 'order-last' : 'order-first'
                        }`}
                ></button>
                <button
                    onClick={() => {
                        setshowpopup(true);
                        setclicked(false);
                    }}
                    className="px-1 py-6 pr-2 cursor-pointer hover:bg-gray-400 transition-colors"
                >
                  <Pen width={18}/>
                </button>
            </div>
        </div>
    );
};

export default Bar;