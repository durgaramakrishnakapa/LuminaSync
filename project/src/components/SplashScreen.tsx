import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SplashScreen: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    const dots = dotsRef.current;

    if (!container || !logo || !dots) return;

    // Initial state
    gsap.set(logo, { opacity: 0, y: 50, scale: 0.8 });
    gsap.set(dots, { opacity: 0 });

    // Animation timeline
    const tl = gsap.timeline();

    tl.to(logo, {
      duration: 1.2,
      opacity: 1,
      y: 0,
      scale: 1,
      ease: "power3.out"
    })
    .to(dots, {
      duration: 0.8,
      opacity: 1,
      ease: "power2.out"
    }, "-=0.5")
    .to([logo, dots], {
      duration: 0.8,
      scale: 1.05,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1
    }, "+=0.5");

    // Animate dots
    gsap.to(dots.children, {
      duration: 0.6,
      scale: 1.3,
      ease: "power2.inOut",
      stagger: 0.1,
      yoyo: true,
      repeat: -1
    });

  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-white flex flex-col items-center justify-center"
    >
      <div ref={logoRef} className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          LuminaSync
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mt-4 font-light">
          Intelligent Meeting Assistant
        </p>
      </div>
      
      <div ref={dotsRef} className="flex space-x-2 mt-12">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default SplashScreen;