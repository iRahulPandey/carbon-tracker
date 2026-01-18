'use client';

import { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
    intensity: 'clean' | 'neutral' | 'dirty';
}

export function ParticleBackground({ intensity }: ParticleBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        // Configuration based on intensity
        const config = {
            clean: {
                count: 60,
                baseColor: [16, 185, 129], // Emerald-500
                speed: 0.5,
                size: 2,
                glow: 15
            },
            neutral: {
                count: 40,
                baseColor: [59, 130, 246], // Blue-500
                speed: 0.3,
                size: 2,
                glow: 10
            },
            dirty: {
                count: 100,
                baseColor: [100, 116, 139], // Slate-500 (Smog)
                speed: 1.5,
                size: 4,
                glow: 0
            }
        }[intensity];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            alpha: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                // Randomize direction
                const angle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(angle) * config.speed;
                this.vy = Math.sin(angle) * config.speed;
                this.size = Math.random() * config.size + 1;
                this.alpha = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges (or wrap)
                if (this.x < 0) this.x = canvas!.width;
                if (this.x > canvas!.width) this.x = 0;
                if (this.y < 0) this.y = canvas!.height;
                if (this.y > canvas!.height) this.y = 0;

                // Jitter for dirty "smog" effect
                if (intensity === 'dirty') {
                    this.x += (Math.random() - 0.5) * 2;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const [r, g, b] = config.baseColor;
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.alpha})`;

                if (config.glow > 0) {
                    ctx.shadowBlur = config.glow;
                    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < config.count; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        init();
        animate();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [intensity]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
            style={{ opacity: 0.6 }}
        />
    );
}
