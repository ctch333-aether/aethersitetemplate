/**
 * AETHER React - Matrix Rain Effect Component
 * Canvas-based digital rain animation with AETHER characters
 */

import { useEffect, useRef } from 'react';

const MATRIX_CHARS = 'AETHER10';

function MatrixRain() {
  const canvasRef = useRef(null);
  const dropsRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const fontSize = 14;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const columns = Math.floor(canvas.width / fontSize);
      dropsRef.current = [];
      for (let i = 0; i < columns; i++) {
        dropsRef.current[i] = Math.random() * canvas.height / fontSize;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const colors = ['#00ff41', '#00ff00', '#33ff33', '#66ff66'];

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const randomChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(randomChar, i * fontSize, dropsRef.current[i] * fontSize);

        if (dropsRef.current[i] * fontSize > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i]++;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    const intervalId = setInterval(() => {
      cancelAnimationFrame(animationRef.current);
      draw();
    }, 50);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        opacity: 0.45,
        mixBlendMode: 'screen',
      }}
    />
  );
}

export default MatrixRain;
