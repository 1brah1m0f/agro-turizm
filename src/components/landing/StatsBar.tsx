"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 84, suffix: "+", label: "SERTİFİKATLI TƏRƏFDAŞ FERMA" },
  { value: 23, suffix: "", label: "MÜXTƏLİF FƏALİYYƏT NÖVÜ" },
  { value: 7200, suffix: "+", display: "7.2K+", label: "AYLIQ AKTİV TURİST" },
  { value: 340, suffix: "K+", display: "340K+", label: "TOPLANMIŞ KOİN" },
];

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return count;
}

function StatItem({ stat, active }: { stat: typeof stats[0]; active: boolean }) {
  const count = useCountUp(stat.value, active);
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <span className="font-serif font-bold text-5xl lg:text-6xl text-text-dark">
        {stat.display ? (active ? stat.display : `0${stat.suffix}`) : `${count}${stat.suffix}`}
      </span>
      <span className="text-xs text-muted uppercase tracking-[0.1em] text-center">{stat.label}</span>
    </div>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-primary-dark py-16 relative overflow-hidden">
      {/* Gradient accent line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-main opacity-40" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-main opacity-40" />
      {/* Decorative dots */}
      <div className="absolute right-0 top-0 bottom-0 w-24 opacity-5 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #55C841 1px, transparent 1px)", backgroundSize: "14px 14px" }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-accent/10">
          {stats.map((stat, i) => <StatItem key={i} stat={stat} active={active} />)}
        </div>
      </div>
    </section>
  );
}
