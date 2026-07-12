"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// A rotating 3D node-graph globe drawn on a 2D canvas — hand-rolled
// perspective projection instead of Three.js to keep the bundle small.
// Nodes sit on a fibonacci sphere; nearby nodes are linked; "packets"
// occasionally travel along edges (systems/network feel).

const NODE_COUNT = 42;
const LINK_DISTANCE = 0.62; // max chord length (unit sphere) to draw an edge
const PACKET_COUNT = 4;
const FOCAL = 3.2;

interface Packet {
  edge: number;
  t: number;
  speed: number;
}

function buildSphere() {
  const nodes: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    nodes.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
  }
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      const dz = nodes[i][2] - nodes[j][2];
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < LINK_DISTANCE) {
        edges.push([i, j]);
      }
    }
  }
  return { nodes, edges };
}

function HeroVisualClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#f2a93b";
    const fg = styles.getPropertyValue("--fg").trim() || "#e7e9ec";

    const { nodes, edges } = buildSphere();
    const packets: Packet[] = Array.from({ length: PACKET_COUNT }, () => ({
      edge: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.006,
    }));

    let rotY = 0.6;
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    // mouse influence, lerped toward target each frame
    let tiltX = 0.25;
    let tiltTargetX = 0.25;
    let spin = 0.0022;
    let spinTarget = 0.0022;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (p: [number, number, number]) => {
      const [x0, y0, z0] = p;
      // rotate around Y, then tilt around X
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);
      const x1 = x0 * cy + z0 * sy;
      const z1 = -x0 * sy + z0 * cy;
      const cx = Math.cos(tiltX);
      const sx = Math.sin(tiltX);
      const y2 = y0 * cx - z1 * sx;
      const z2 = y0 * sx + z1 * cx;
      const scale = FOCAL / (FOCAL + z2);
      const radius = Math.min(width, height) * 0.36;
      return {
        x: width / 2 + x1 * scale * radius,
        y: height / 2 + y2 * scale * radius,
        depth: scale, // ~0.76 (back) .. ~1.45 (front)
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      tiltX += (tiltTargetX - tiltX) * 0.04;
      spin += (spinTarget - spin) * 0.04;
      rotY += spin;

      const projected = nodes.map(project);

      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        const depth = (pa.depth + pb.depth) / 2 - 0.75;
        ctx.strokeStyle = fg;
        ctx.globalAlpha = Math.max(0.02, depth * 0.16);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      projected.forEach((p, i) => {
        const isAccent = i % 7 === 0;
        const size = (isAccent ? 2.4 : 1.6) * p.depth;
        ctx.globalAlpha = Math.max(0.15, (p.depth - 0.75) * 1.1);
        ctx.fillStyle = isAccent ? accent : fg;
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      });

      for (const packet of packets) {
        packet.t += packet.speed;
        if (packet.t >= 1) {
          packet.t = 0;
          packet.edge = Math.floor(Math.random() * edges.length);
        }
        const [a, b] = edges[packet.edge];
        const pa = projected[a];
        const pb = projected[b];
        const x = pa.x + (pb.x - pa.x) * packet.t;
        const y = pa.y + (pb.y - pa.y) * packet.t;
        const depth = pa.depth + (pb.depth - pa.depth) * packet.t;
        ctx.globalAlpha = Math.max(0.2, (depth - 0.75) * 1.3);
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x, y, 1.8 * depth, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || prefersReducedMotion) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMouseMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
      const ny = e.clientY / window.innerHeight - 0.5;
      spinTarget = 0.0022 + nx * 0.003;
      tiltTargetX = 0.25 + ny * 0.35;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (prefersReducedMotion) {
      draw(); // single static frame
    } else {
      // pause the rAF loop whenever the hero is scrolled out of view
      const io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? start() : stop()),
        { threshold: 0 }
      );
      io.observe(canvas);
      window.addEventListener("mousemove", onMouseMove, { passive: true });

      return () => {
        stop();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("mousemove", onMouseMove);
      };
    }

    return () => ro.disconnect();
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
      className="h-full w-full"
    />
  );
}

// Client-only + code-split: the canvas math never runs during SSR and the
// chunk loads after the initial paint.
export const HeroVisual = dynamic(() => Promise.resolve(HeroVisualClient), {
  ssr: false,
});
