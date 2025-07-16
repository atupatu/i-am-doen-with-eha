
import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface StatCardProps {
  icon: React.ReactNode;
  endValue: number;
  label: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const StatCard = ({
  icon,
  endValue,
  label,
  duration = 2000,
  prefix = '',
  suffix = ''
}: StatCardProps) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const startTime = useRef<number | null>(null);
  const frameId = useRef<number | null>(null);
  
  // Animation function
  const animate = (timestamp: number) => {
    if (!startTime.current) startTime.current = timestamp;
    const progress = timestamp - startTime.current;
    
    // Calculate the current count based on the progress
    const progressRatio = Math.min(progress / duration, 1);
    const easedProgress = easeOutQuad(progressRatio);
    const currentCount = Math.floor(easedProgress * endValue);
    
    setCount(currentCount);
    
    // Continue animation until complete
    if (progress < duration) {
      frameId.current = requestAnimationFrame(animate);
    } else {
      setCount(endValue);
    }
  };
  
  // Easing function for smoother animation
  const easeOutQuad = (t: number): number => {
    return t * (2 - t);
  };
  
  useEffect(() => {
    if (inView && count !== endValue) {
      startTime.current = null;
      frameId.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [inView, endValue]);
  
  return (
    <div 
      ref={ref}
      className="bg-gradient-to-br from-[#f8eef5] to-white p-8 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center transform hover:-translate-y-1"
    >
      <div className="bg-[#a98cc8]/20 p-4 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-2">
        {prefix}{count}{suffix}
      </h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

export default StatCard;