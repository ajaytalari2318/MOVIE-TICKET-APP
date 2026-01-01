import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loading screen after 3.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      animation: 'fadeOut 0.8s ease-out 2.8s forwards'
    }}>
      <style>{`
        @keyframes fadeOut {
          to {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes ribbonReveal {
          0% {
            clip-path: inset(0 100% 0 0);
          }
          50% {
            clip-path: inset(0 0 0 0);
          }
          100% {
            clip-path: inset(0 0 0 0);
          }
        }

        @keyframes streaks {
          0% {
            opacity: 0;
            transform: translateX(-100%) skewX(-20deg);
          }
          50% {
            opacity: 1;
            transform: translateX(0) skewX(-20deg);
          }
          100% {
            opacity: 0;
            transform: translateX(100%) skewX(-20deg);
          }
        }

        .logo-text {
          font-size: clamp(60px, 10vw, 120px);
          font-weight: 900;
          color: #e50914; /* Netflix red */
          
          position: relative;
          user-select: none;
          animation: ribbonReveal 1.5s ease-out forwards;
        }

        .streak {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, transparent, #e50914, transparent);
          animation: streaks 2s ease-in-out infinite;
        }
      `}</style>

      <div style={{ position: 'relative' }}>
        <div className="logo-text">BookMyShow</div>
        <div className="streak"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
