'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

export function DoubleTapIndicator() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let active = true;
    function trigger() {
      if (!active) return;
      setVisible(true);
      setTimeout(() => active && setVisible(false), 1200);
    }
    const id = setInterval(trigger, 8000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);
  if (!visible) return null;
  return (
    <div
      className="hidden sm:flex fixed bottom-20 right-4 z-30 items-center gap-2 bg-text text-bg px-3 py-2 text-xs font-medium tracking-wide shadow-lg pointer-events-none"
      role="status"
    >
      <Heart className="h-3.5 w-3.5 fill-current" />
      <span>Double-tap a card to like</span>
    </div>
  );
}
