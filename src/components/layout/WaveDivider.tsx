interface WaveDividerProps {
  fill?: string;
  flipped?: boolean;
}

export default function WaveDivider({ fill = "#1A688E", flipped = false }: WaveDividerProps) {
  return (
    <div className={`relative w-full overflow-hidden leading-none ${flipped ? "rotate-180" : ""}`} style={{ height: 56 }}>
      <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none" className="absolute bottom-0 w-full" style={{ height: 56 }}>
        <path d="M0,28 C360,56 720,0 1080,28 C1260,42 1380,14 1440,28 L1440,56 L0,56 Z" fill={fill} />
      </svg>
    </div>
  );
}
