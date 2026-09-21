import { useEffect, useRef, type RefObject } from 'react';

/** Procedural light sculpture: no video download or WebGL dependency. */
export default function FlowField({ paused, anchorRef }: { paused: boolean; anchorRef: RefObject<HTMLSpanElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    let frame = 0, width = 0, height = 0, last = 0, time = 0;
    let visible = true, disposed = false, anchorInkOffsetY = 0;
    function draw() {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      const mobile = width < 700;
      const scale = Math.min(width * (mobile ? 0.94 : 0.45), height * 0.77);
      const anchor = anchorRef.current?.getBoundingClientRect();
      const canvasBox = canvas!.getBoundingClientRect();
      // Anchor the inner left bend of the projected ring to the actual x glyph.
      // Its position remains stable as the strands move around the sculpture.
      const bendAngle = Math.atan2(-0.4, 0.85) + Math.PI;
      const innerRadius = 0.7 - 0.16;
      const bendX = (Math.cos(bendAngle) * 0.85 - Math.sin(bendAngle) * 0.4) * innerRadius * 1.3;
      const bendY = (Math.cos(bendAngle) * 0.24 + Math.sin(bendAngle) * 0.56) * innerRadius * 1.36;
      const cx = anchor ? anchor.left - canvasBox.left + anchor.width / 2 - bendX * scale : width * 0.77;
      const cy = anchor ? anchor.top - canvasBox.top + anchorInkOffsetY - bendY * scale : height * 0.47;
      const glow = context.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.3);
      glow.addColorStop(0, 'rgba(147,48,15,0.13)');
      glow.addColorStop(0.55, 'rgba(114,31,10,0.07)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      const strands = mobile ? 42 : 66;
      for (let strand = 0; strand < strands; strand++) {
        const v = strand / (strands - 1);
        const phase = v * Math.PI * 2;
        context.beginPath();
        for (let point = 0; point <= 180; point++) {
          const a = point / 180 * Math.PI * 2;
          const radius = 0.7 + 0.16 * Math.cos(phase + a * 2 + time * 0.23);
          const x = Math.cos(a) * radius, y = Math.sin(a) * radius;
          const depth = Math.sin(phase + a * 2 + time * 0.23) * 0.21;
          const px = cx + (x * 0.85 - y * 0.4) * scale * 1.3;
          const py = cy + (x * 0.24 + y * 0.56 + depth) * scale * 1.36;
          if (point === 0) context.moveTo(px, py); else context.lineTo(px, py);
        }
        const luminosity = 0.18 + Math.pow(Math.sin(v * Math.PI), 6) * 0.45;
        context.strokeStyle = `rgba(255,${105 + Math.round(v * 72)},${48 + Math.round(v * 54)},${luminosity})`;
        context.lineWidth = strand % 9 === 0 ? 1.2 : 0.65;
        context.stroke();
      }
    }
    function tick(now: number) {
      if (!visible || document.hidden || paused) { frame = 0; return; }
      if (now - last >= 32) { time += Math.min((now - last) / 1000, 0.05); last = now; draw(); }
      frame = requestAnimationFrame(tick);
    }
    function start() {
      if (!frame && visible && !document.hidden && !paused) {
        last = performance.now(); frame = requestAnimationFrame(tick);
      }
    }
    function resize() {
      if (!canvas || !context) return;
      const box = canvas.getBoundingClientRect(); width = box.width; height = box.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const anchor = anchorRef.current;
      if (anchor) {
        const style = getComputedStyle(anchor);
        context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const metrics = context.measureText('x');
        const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize);
        const ascent = metrics.fontBoundingBoxAscent ?? parseFloat(style.fontSize) * .8;
        const descent = metrics.fontBoundingBoxDescent ?? parseFloat(style.fontSize) * .2;
        const baseline = (lineHeight - ascent - descent) / 2 + ascent;
        anchorInkOffsetY = baseline + (metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent) / 2;
      }
      draw();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    if (anchorRef.current) resizeObserver.observe(anchorRef.current);
    const fontsReady = () => { if (!disposed) resize(); };
    void document.fonts.ready.then(fontsReady);
    document.fonts.addEventListener('loadingdone', fontsReady);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); });
    visibilityObserver.observe(canvas);
    document.addEventListener('visibilitychange', start);
    resize(); start();
    return () => { disposed = true; cancelAnimationFrame(frame); resizeObserver.disconnect(); visibilityObserver.disconnect(); document.fonts.removeEventListener('loadingdone', fontsReady); document.removeEventListener('visibilitychange', start); };
  }, [paused, anchorRef]);
  return <canvas ref={ref} className="flow-field" aria-hidden="true" />;
}
