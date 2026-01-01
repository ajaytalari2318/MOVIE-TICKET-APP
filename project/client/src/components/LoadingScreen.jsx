import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide loading screen after 3.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 3500);

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
      animation: 'fadeOut 0.5s ease-out 3s forwards'
    }}>
      <style>{`
        @keyframes fadeOut {
          to {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.2);
          }
        }

        @keyframes glitch {
          0% {
            text-shadow: 
              0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow: 
              0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow: 
              -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow: 
              -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow: 
              0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow: 
              0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow: 
              -0.025em 0 0 rgba(255, 0, 0, 0.75),
              -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }

        @keyframes loading {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes sparkleAnimation {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .logo-text {
          font-size: clamp(40px, 8vw, 80px);
          font-weight: 900;
          letter-spacing: clamp(4px, 1vw, 8px);
          color: transparent;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          background-clip: text;
          animation: glitch 2s infinite, pulse 2s ease-in-out infinite;
          text-transform: uppercase;
          position: relative;
          user-select: none;
        }

        .loading-bar {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: min(300px, 80vw);
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .loading-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent,
            #667eea,
            #764ba2,
            transparent
          );
          animation: loading 1.5s ease-in-out infinite;
        }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: sparkleAnimation 1s ease-in-out infinite;
          opacity: 0;
          pointer-events: none;
        }
      `}</style>

      <div style={{ position: 'relative' }}>
        <div className="logo-text">BookMyShow</div>
        <div className="loading-bar"></div>
        
        {/* Sparkles */}
        {[...Array(20)].map((_, i) => {
          const angle = (Math.PI * 2 * i) / 20;
          const distance = 150 + Math.random() * 50;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          
          return (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LoadingScreen;