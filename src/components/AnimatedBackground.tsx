import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const AnimatedBackground: React.FC = () => {
  const { backgroundPattern, animationEnabled, mode, palette } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!animationEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initPattern();
    };

    window.addEventListener('resize', handleResize);

    // ----------------------------------------------------
    // PALETTE COLOR THEMES (Synchronized with selected theme)
    // ----------------------------------------------------
    const isDark = mode === 'dark';

    const getPaletteColors = () => {
      switch (palette) {
        case 'gold':
          return {
            bubbleColors: isDark
              ? [
                  { mid: 'rgba(245, 158, 11, ', end: 'rgba(217, 119, 6, ', stroke: 'rgba(251, 191, 36, ' },
                  { mid: 'rgba(217, 119, 6, ', end: 'rgba(180, 83, 9, ', stroke: 'rgba(245, 158, 11, ' },
                  { mid: 'rgba(251, 191, 36, ', end: 'rgba(245, 158, 11, ', stroke: 'rgba(253, 230, 138, ' },
                ]
              : [
                  { mid: 'rgba(217, 119, 6, ', end: 'rgba(180, 83, 9, ', stroke: 'rgba(180, 83, 9, ' },
                  { mid: 'rgba(245, 158, 11, ', end: 'rgba(217, 119, 6, ', stroke: 'rgba(217, 119, 6, ' },
                  { mid: 'rgba(251, 191, 36, ', end: 'rgba(245, 158, 11, ', stroke: 'rgba(217, 119, 6, ' },
                ],
            stars: isDark
              ? ['#ffffff', '#fef08a', '#fde047', '#f59e0b', '#fbbf24', '#fef9c3']
              : ['#b45309', '#d97706', '#f59e0b', '#ca8a04', '#78350f'],
            shootingStar: isDark ? 'rgba(245, 158, 11, ' : 'rgba(217, 119, 6, ',
            atoms: {
              nucleus: isDark
                ? ['#fef08a', '#fbbf24', '#f59e0b', '#b45309']
                : ['#fef9c3', '#fde047', '#f59e0b', '#ca8a04'],
              nucleusGlow: isDark ? 'rgba(245, 158, 11, 0.45)' : 'rgba(217, 119, 6, 0.3)',
              orbitStroke: isDark ? 'rgba(251, 191, 36, 0.35)' : 'rgba(217, 119, 6, 0.28)',
              electrons: isDark
                ? ['#fef08a', '#facc15', '#f59e0b', '#ffffff']
                : ['#b45309', '#f59e0b', '#d97706', '#ca8a04'],
              electronGlow: isDark ? 'rgba(250, 204, 21, 0.85)' : 'rgba(217, 119, 6, 0.6)',
            },
          };

        case 'pink':
          return {
            bubbleColors: isDark
              ? [
                  { mid: 'rgba(236, 72, 153, ', end: 'rgba(190, 24, 93, ', stroke: 'rgba(244, 114, 182, ' },
                  { mid: 'rgba(192, 132, 252, ', end: 'rgba(147, 51, 234, ', stroke: 'rgba(216, 180, 254, ' },
                  { mid: 'rgba(244, 114, 182, ', end: 'rgba(236, 72, 153, ', stroke: 'rgba(251, 207, 232, ' },
                ]
              : [
                  { mid: 'rgba(219, 39, 119, ', end: 'rgba(190, 24, 93, ', stroke: 'rgba(190, 24, 93, ' },
                  { mid: 'rgba(168, 85, 247, ', end: 'rgba(147, 51, 234, ', stroke: 'rgba(126, 34, 206, ' },
                  { mid: 'rgba(244, 114, 182, ', end: 'rgba(219, 39, 119, ', stroke: 'rgba(190, 24, 93, ' },
                ],
            stars: isDark
              ? ['#ffffff', '#f472b6', '#ec4899', '#f9a8d4', '#e879f9', '#c084fc']
              : ['#be185d', '#db2777', '#ec4899', '#a21caf', '#7e22ce'],
            shootingStar: isDark ? 'rgba(236, 72, 153, ' : 'rgba(219, 39, 119, ',
            atoms: {
              nucleus: isDark
                ? ['#fce7f3', '#f472b6', '#ec4899', '#9d174d']
                : ['#fdf2f8', '#f472b6', '#db2777', '#9d174d'],
              nucleusGlow: isDark ? 'rgba(236, 72, 153, 0.45)' : 'rgba(219, 39, 119, 0.3)',
              orbitStroke: isDark ? 'rgba(244, 114, 182, 0.35)' : 'rgba(219, 39, 119, 0.28)',
              electrons: isDark
                ? ['#f472b6', '#c084fc', '#e879f9', '#ffffff']
                : ['#be185d', '#ec4899', '#db2777', '#a21caf'],
              electronGlow: isDark ? 'rgba(244, 114, 182, 0.85)' : 'rgba(219, 39, 119, 0.6)',
            },
          };

        case 'nature':
          return {
            bubbleColors: isDark
              ? [
                  { mid: 'rgba(16, 185, 129, ', end: 'rgba(5, 150, 105, ', stroke: 'rgba(52, 211, 153, ' },
                  { mid: 'rgba(5, 150, 105, ', end: 'rgba(4, 120, 87, ', stroke: 'rgba(110, 231, 183, ' },
                  { mid: 'rgba(13, 148, 136, ', end: 'rgba(16, 185, 129, ', stroke: 'rgba(94, 234, 212, ' },
                ]
              : [
                  { mid: 'rgba(5, 150, 105, ', end: 'rgba(4, 120, 87, ', stroke: 'rgba(4, 120, 87, ' },
                  { mid: 'rgba(16, 185, 129, ', end: 'rgba(5, 150, 105, ', stroke: 'rgba(5, 150, 105, ' },
                  { mid: 'rgba(13, 148, 136, ', end: 'rgba(5, 150, 105, ', stroke: 'rgba(15, 118, 110, ' },
                ],
            stars: isDark
              ? ['#ffffff', '#6ee7b7', '#a7f3d0', '#34d399', '#5eead4', '#bef264']
              : ['#047857', '#059669', '#10b981', '#0f766e', '#15803d'],
            shootingStar: isDark ? 'rgba(16, 185, 129, ' : 'rgba(5, 150, 105, ',
            atoms: {
              nucleus: isDark
                ? ['#d1fae5', '#34d399', '#10b981', '#065f46']
                : ['#ecfdf5', '#34d399', '#059669', '#065f46'],
              nucleusGlow: isDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(5, 150, 105, 0.3)',
              orbitStroke: isDark ? 'rgba(52, 211, 153, 0.35)' : 'rgba(5, 150, 105, 0.28)',
              electrons: isDark
                ? ['#6ee7b7', '#34d399', '#5eead4', '#ffffff']
                : ['#047857', '#10b981', '#059669', '#0f766e'],
              electronGlow: isDark ? 'rgba(52, 211, 153, 0.85)' : 'rgba(5, 150, 105, 0.6)',
            },
          };

        case 'space':
          return {
            bubbleColors: isDark
              ? [
                  { mid: 'rgba(6, 182, 212, ', end: 'rgba(8, 145, 178, ', stroke: 'rgba(34, 211, 238, ' },
                  { mid: 'rgba(59, 130, 246, ', end: 'rgba(37, 99, 235, ', stroke: 'rgba(96, 165, 250, ' },
                  { mid: 'rgba(139, 92, 246, ', end: 'rgba(6, 182, 212, ', stroke: 'rgba(167, 139, 250, ' },
                ]
              : [
                  { mid: 'rgba(8, 145, 178, ', end: 'rgba(14, 116, 144, ', stroke: 'rgba(14, 116, 144, ' },
                  { mid: 'rgba(37, 99, 235, ', end: 'rgba(29, 78, 216, ', stroke: 'rgba(29, 78, 216, ' },
                  { mid: 'rgba(124, 58, 237, ', end: 'rgba(8, 145, 178, ', stroke: 'rgba(109, 40, 217, ' },
                ],
            stars: isDark
              ? ['#ffffff', '#67e8f9', '#38bdf8', '#818cf8', '#c084fc', '#22d3ee']
              : ['#0284c7', '#0891b2', '#2563eb', '#4f46e5', '#0369a1'],
            shootingStar: isDark ? 'rgba(6, 182, 212, ' : 'rgba(8, 145, 178, ',
            atoms: {
              nucleus: isDark
                ? ['#cffafe', '#38bdf8', '#2563eb', '#1e1b4b']
                : ['#e0f2fe', '#38bdf8', '#0284c7', '#1e3a8a'],
              nucleusGlow: isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.3)',
              orbitStroke: isDark ? 'rgba(34, 211, 238, 0.35)' : 'rgba(2, 132, 199, 0.28)',
              electrons: isDark
                ? ['#38bdf8', '#818cf8', '#22d3ee', '#ffffff']
                : ['#0284c7', '#2563eb', '#0891b2', '#4f46e5'],
              electronGlow: isDark ? 'rgba(56, 189, 248, 0.85)' : 'rgba(2, 132, 199, 0.6)',
            },
          };

        case 'black':
          return {
            bubbleColors: isDark
              ? [
                  { mid: 'rgba(239, 68, 68, ', end: 'rgba(185, 28, 28, ', stroke: 'rgba(248, 113, 113, ' },
                  { mid: 'rgba(226, 232, 240, ', end: 'rgba(148, 163, 184, ', stroke: 'rgba(255, 255, 255, ' },
                  { mid: 'rgba(220, 38, 38, ', end: 'rgba(153, 27, 27, ', stroke: 'rgba(252, 165, 165, ' },
                ]
              : [
                  { mid: 'rgba(220, 38, 38, ', end: 'rgba(185, 28, 28, ', stroke: 'rgba(153, 27, 27, ' },
                  { mid: 'rgba(71, 85, 105, ', end: 'rgba(51, 65, 85, ', stroke: 'rgba(30, 41, 59, ' },
                  { mid: 'rgba(239, 68, 68, ', end: 'rgba(185, 28, 28, ', stroke: 'rgba(185, 28, 28, ' },
                ],
            stars: isDark
              ? ['#ffffff', '#f87171', '#ef4444', '#fca5a5', '#cbd5e1', '#fee2e2']
              : ['#dc2626', '#b91c1c', '#334155', '#475569', '#991b1b'],
            shootingStar: isDark ? 'rgba(239, 68, 68, ' : 'rgba(220, 38, 38, ',
            atoms: {
              nucleus: isDark
                ? ['#fee2e2', '#f87171', '#ef4444', '#7f1d1d']
                : ['#fef2f2', '#f87171', '#dc2626', '#991b1b'],
              nucleusGlow: isDark ? 'rgba(239, 68, 68, 0.45)' : 'rgba(220, 38, 38, 0.3)',
              orbitStroke: isDark ? 'rgba(248, 113, 113, 0.35)' : 'rgba(220, 38, 38, 0.28)',
              electrons: isDark
                ? ['#f87171', '#ef4444', '#fca5a5', '#ffffff']
                : ['#dc2626', '#b91c1c', '#ef4444', '#991b1b'],
              electronGlow: isDark ? 'rgba(239, 68, 68, 0.85)' : 'rgba(220, 38, 38, 0.6)',
            },
          };

        case 'indigo':
        default:
          return {
            bubbleColors: isDark
              ? [
                  { mid: 'rgba(148, 163, 184, ', end: 'rgba(100, 116, 139, ', stroke: 'rgba(226, 232, 240, ' },
                  { mid: 'rgba(203, 213, 225, ', end: 'rgba(148, 163, 184, ', stroke: 'rgba(241, 245, 249, ' },
                  { mid: 'rgba(100, 116, 139, ', end: 'rgba(71, 85, 105, ', stroke: 'rgba(203, 213, 225, ' },
                ]
              : [
                  { mid: 'rgba(100, 116, 139, ', end: 'rgba(71, 85, 105, ', stroke: 'rgba(51, 65, 85, ' },
                  { mid: 'rgba(148, 163, 184, ', end: 'rgba(100, 116, 139, ', stroke: 'rgba(71, 85, 105, ' },
                  { mid: 'rgba(71, 85, 105, ', end: 'rgba(51, 65, 85, ', stroke: 'rgba(30, 41, 59, ' },
                ],
            stars: isDark
              ? ['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8', '#ffffff']
              : ['#0f172a', '#334155', '#475569', '#64748b', '#1e293b'],
            shootingStar: isDark ? 'rgba(255, 255, 255, ' : 'rgba(100, 116, 139, ',
            atoms: {
              nucleus: isDark
                ? ['#ffffff', '#cbd5e1', '#94a3b8', '#334155']
                : ['#f8fafc', '#94a3b8', '#64748b', '#1e293b'],
              nucleusGlow: isDark ? 'rgba(203, 213, 225, 0.45)' : 'rgba(100, 116, 139, 0.3)',
              orbitStroke: isDark ? 'rgba(226, 232, 240, 0.35)' : 'rgba(100, 116, 139, 0.28)',
              electrons: isDark
                ? ['#ffffff', '#e2e8f0', '#94a3b8', '#cbd5e1']
                : ['#334155', '#475569', '#64748b', '#0f172a'],
              electronGlow: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(100, 116, 139, 0.6)',
            },
          };
      }
    };

    const paletteTheme = getPaletteColors();

    // ----------------------------------------------------
    // Pattern 1: Rising Soft Bubbles (Rich, visibly glowing)
    // ----------------------------------------------------
    interface Bubble {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      wobbleSpeed: number;
      wobbleAmp: number;
      phase: number;
      opacity: number;
      colorIndex: number;
    }

    let bubbles: Bubble[] = [];

    const initBubbles = () => {
      bubbles = [];
      const count = Math.max(35, Math.floor(width / 32));
      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 12 + Math.random() * 28,
          speedY: 0.6 + Math.random() * 1.1,
          wobbleSpeed: 0.015 + Math.random() * 0.025,
          wobbleAmp: 18 + Math.random() * 30,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.22 + Math.random() * 0.28,
          colorIndex: Math.floor(Math.random() * 3),
        });
      }
    };

    const renderBubbles = () => {
      ctx.clearRect(0, 0, width, height);

      bubbles.forEach((b) => {
        b.y -= b.speedY;
        b.phase += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.phase) * b.wobbleAmp;

        if (b.y + b.radius < -10) {
          b.y = height + b.radius + Math.random() * 30;
          b.x = Math.random() * width;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(currentX, b.y, b.radius, 0, Math.PI * 2);

        const grad = ctx.createRadialGradient(
          currentX - b.radius * 0.35,
          b.y - b.radius * 0.35,
          b.radius * 0.08,
          currentX,
          b.y,
          b.radius
        );

        const colorSet = paletteTheme.bubbleColors[b.colorIndex % paletteTheme.bubbleColors.length];

        if (isDark) {
          grad.addColorStop(0, `rgba(255, 255, 255, ${b.opacity * 1.8})`);
          grad.addColorStop(0.5, `${colorSet.mid}${b.opacity * 0.9})`);
          grad.addColorStop(1, `${colorSet.end}${b.opacity * 0.25})`);
          ctx.strokeStyle = `${colorSet.stroke}${b.opacity * 1.1})`;
        } else {
          grad.addColorStop(0, `rgba(255, 255, 255, ${b.opacity * 2.2})`);
          grad.addColorStop(0.5, `${colorSet.mid}${b.opacity * 0.75})`);
          grad.addColorStop(1, `${colorSet.end}${b.opacity * 0.2})`);
          ctx.strokeStyle = `${colorSet.stroke}${b.opacity * 0.95})`;
        }

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Highlight glint spot
        ctx.beginPath();
        ctx.arc(
          currentX - b.radius * 0.35,
          b.y - b.radius * 0.35,
          b.radius * 0.22,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${b.opacity * 2.2})`
          : `rgba(255, 255, 255, ${b.opacity * 2.8})`;
        ctx.fill();

        ctx.restore();
      });
    };

    // ----------------------------------------------------
    // Pattern 2: Space Glowing Stars (Twinkle matching theme)
    // ----------------------------------------------------
    interface Star {
      x: number;
      y: number;
      baseRadius: number;
      twinkleSpeed: number;
      phase: number;
      color: string;
    }

    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }

    let stars: Star[] = [];
    let shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      angle: 0,
      opacity: 0,
      active: false,
    };
    let nextShootingStarTime = performance.now() + 2000;

    const initStars = () => {
      stars = [];
      const count = Math.max(90, Math.floor((width * height) / 8000));
      const starColors = paletteTheme.stars;

      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseRadius: 1.0 + Math.random() * 2.4,
          twinkleSpeed: 0.025 + Math.random() * 0.045,
          phase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    const renderStars = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.phase += s.twinkleSpeed;
        const brightness = 0.35 + 0.65 * Math.abs(Math.sin(s.phase));
        const r = s.baseRadius * (0.8 + 0.35 * brightness);

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = isDark ? brightness * 0.95 : brightness * 0.7;
        ctx.shadowBlur = r * 5;
        ctx.shadowColor = s.color;
        ctx.fill();
        ctx.restore();
      });

      // Shooting star trigger
      if (!shootingStar.active && time > nextShootingStarTime) {
        shootingStar = {
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.35,
          length: 90 + Math.random() * 80,
          speed: 10 + Math.random() * 6,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          opacity: 1,
          active: true,
        };
        nextShootingStarTime = time + 3500 + Math.random() * 4000;
      }

      if (shootingStar.active) {
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.016;

        if (
          shootingStar.opacity <= 0 ||
          shootingStar.x > width ||
          shootingStar.y > height
        ) {
          shootingStar.active = false;
        } else {
          ctx.save();
          ctx.beginPath();
          const tailX =
            shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY =
            shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
          const grad = ctx.createLinearGradient(
            tailX,
            tailY,
            shootingStar.x,
            shootingStar.y
          );
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(
            1,
            `${paletteTheme.shootingStar}${shootingStar.opacity})`
          );

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.2;
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(shootingStar.x, shootingStar.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    };

    // ----------------------------------------------------
    // Pattern 3: Quantum Atoms Animation (Matching AtomLogo.tsx)
    // ----------------------------------------------------
    interface OrbitConfig {
      tiltDeg: number;
      a: number; // semi-major axis
      b: number; // semi-minor axis
      angle: number;
      speed: number;
      electronColor: string;
      electronSize: number;
    }

    interface AtomEntity {
      x: number;
      y: number;
      vx: number;
      vy: number;
      nucleusRadius: number;
      orbits: OrbitConfig[];
    }

    let atomsList: AtomEntity[] = [];

    const initAtoms = () => {
      atomsList = [];
      const count = Math.max(6, Math.min(11, Math.floor(width / 150)));
      const tilts = [-35, 35, 80, -75];

      for (let i = 0; i < count; i++) {
        const nucleusRadius = 8 + Math.random() * 8; // 8px to 16px
        const baseA = nucleusRadius * 2.3;
        const baseB = baseA * 0.42;

        const orbits: OrbitConfig[] = tilts.map((tilt, idx) => ({
          tiltDeg: tilt + (Math.random() * 8 - 4),
          a: baseA + (idx * 2.8),
          b: baseB + (idx * 1.3),
          angle: (idx * Math.PI) / 2 + Math.random() * Math.PI,
          speed: (0.9 + Math.random() * 0.6) * (idx % 2 === 0 ? 1 : -1),
          electronColor: paletteTheme.atoms.electrons[idx % paletteTheme.atoms.electrons.length],
          electronSize: 2.8 + Math.random() * 1.2,
        }));

        atomsList.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          nucleusRadius,
          orbits,
        });
      }
    };

    let lastAtomTime = performance.now();

    const renderAtoms = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const dt = Math.min((now - lastAtomTime) / 1000, 0.08);
      lastAtomTime = now;

      atomsList.forEach((atom) => {
        // Drift slowly across canvas
        atom.x += atom.vx;
        atom.y += atom.vy;

        const margin = 80;
        if (atom.x < -margin) atom.x = width + margin;
        if (atom.x > width + margin) atom.x = -margin;
        if (atom.y < -margin) atom.y = height + margin;
        if (atom.y > height + margin) atom.y = -margin;

        atom.orbits.forEach((orb) => {
          orb.angle += orb.speed * dt;
        });

        // 1. Draw Behind Electrons (orbits where Math.sin(theta) < 0)
        atom.orbits.forEach((orb) => {
          if (Math.sin(orb.angle) < 0) {
            const xLocal = orb.a * Math.cos(orb.angle);
            const yLocal = orb.b * Math.sin(orb.angle);
            const rad = (orb.tiltDeg * Math.PI) / 180;
            const ex = atom.x + xLocal * Math.cos(rad) - yLocal * Math.sin(rad);
            const ey = atom.y + xLocal * Math.sin(rad) + yLocal * Math.cos(rad);

            ctx.save();
            ctx.beginPath();
            ctx.arc(ex, ey, orb.electronSize * 0.82, 0, Math.PI * 2);
            ctx.fillStyle = orb.electronColor;
            ctx.globalAlpha = 0.65;
            ctx.shadowColor = paletteTheme.atoms.electronGlow;
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.restore();
          }
        });

        // 2. Draw Elliptical Orbital Path Rings
        atom.orbits.forEach((orb) => {
          ctx.save();
          ctx.translate(atom.x, atom.y);
          ctx.rotate((orb.tiltDeg * Math.PI) / 180);
          ctx.beginPath();
          ctx.ellipse(0, 0, orb.a, orb.b, 0, 0, Math.PI * 2);
          ctx.strokeStyle = paletteTheme.atoms.orbitStroke;
          ctx.lineWidth = 1.1;
          ctx.stroke();
          ctx.restore();
        });

        // 3. Draw Central Nucleus Sphere (Matching AtomLogo.tsx)
        const nr = atom.nucleusRadius;
        const grad = ctx.createRadialGradient(
          atom.x - nr * 0.35,
          atom.y - nr * 0.35,
          nr * 0.1,
          atom.x,
          atom.y,
          nr
        );
        grad.addColorStop(0, paletteTheme.atoms.nucleus[0]);
        grad.addColorStop(0.38, paletteTheme.atoms.nucleus[1]);
        grad.addColorStop(0.82, paletteTheme.atoms.nucleus[2]);
        grad.addColorStop(1, paletteTheme.atoms.nucleus[3]);

        ctx.save();
        // Nucleus outer glow aura
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, nr * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = paletteTheme.atoms.nucleusGlow;
        ctx.fill();

        // Main sphere
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, nr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = paletteTheme.atoms.nucleusGlow;
        ctx.shadowBlur = 8;
        ctx.fill();

        // Specular glint highlight
        ctx.beginPath();
        ctx.arc(atom.x - nr * 0.32, atom.y - nr * 0.32, nr * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        ctx.restore();

        // 4. Draw In-Front Electrons (orbits where Math.sin(theta) >= 0)
        atom.orbits.forEach((orb) => {
          if (Math.sin(orb.angle) >= 0) {
            const xLocal = orb.a * Math.cos(orb.angle);
            const yLocal = orb.b * Math.sin(orb.angle);
            const rad = (orb.tiltDeg * Math.PI) / 180;
            const ex = atom.x + xLocal * Math.cos(rad) - yLocal * Math.sin(rad);
            const ey = atom.y + xLocal * Math.sin(rad) + yLocal * Math.cos(rad);

            ctx.save();
            ctx.beginPath();
            ctx.arc(ex, ey, orb.electronSize * 1.15, 0, Math.PI * 2);
            ctx.fillStyle = orb.electronColor;
            ctx.shadowColor = paletteTheme.atoms.electronGlow;
            ctx.shadowBlur = 8;
            ctx.fill();

            // Inner specular white glint
            ctx.beginPath();
            ctx.arc(ex - 0.6, ey - 0.6, orb.electronSize * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.restore();
          }
        });
      });
    };

    // ----------------------------------------------------
    // Loop Dispatcher
    // ----------------------------------------------------
    const initPattern = () => {
      if (backgroundPattern === 'bubbles') initBubbles();
      else if (backgroundPattern === 'stars') initStars();
      else initAtoms(); // 'atoms' or 'waves'
    };

    initPattern();

    const loop = (timestamp: number) => {
      if (backgroundPattern === 'bubbles') {
        renderBubbles();
      } else if (backgroundPattern === 'stars') {
        renderStars(timestamp);
      } else {
        renderAtoms(timestamp);
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [backgroundPattern, animationEnabled, mode, palette]);

  if (!animationEnabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"
      style={{
        opacity: mode === 'dark' ? 0.95 : 0.85,
      }}
    />
  );
};
