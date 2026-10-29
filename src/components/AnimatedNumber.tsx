import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 450,
  format = (n) => Math.round(n).toLocaleString(),
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (displayValue === value) return;

    setIsChanging(true);
    const startValue = displayValue;
    const diff = value - startValue;
    const startTime = performance.now();

    let animationFrameId: number;

    const updateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + diff * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(value);
        setIsChanging(false);
      }
    };

    animationFrameId = requestAnimationFrame(updateNumber);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return (
    <span
      className={`inline-block transition-transform duration-200 ${
        isChanging ? 'scale-105 text-[#00e5c9]' : ''
      } ${className}`}
    >
      {format(displayValue)}
    </span>
  );
};
