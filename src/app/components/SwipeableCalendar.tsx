import React, { useRef } from "react";

const SWIPE_THRESHOLD_PX = 48;

type SwipeableCalendarProps = {
  children: React.ReactNode;
  onSwipeMonth: (direction: "prev" | "next") => void;
};

export function SwipeableCalendar({
  children,
  onSwipeMonth,
}: SwipeableCalendarProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

    onSwipeMonth(deltaX < 0 ? "next" : "prev");
  };

  return (
    <div
      className="touch-pan-y select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}
