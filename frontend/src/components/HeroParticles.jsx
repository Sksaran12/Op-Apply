import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate 35 random particles
    const generated = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1.5,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * -15 // Start immediately by having negative delay
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            bottom: '-10px',
          }}
          animate={{
            y: ['0vh', '-110vh'],
            opacity: [0, 0.6, 0.6, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
}
