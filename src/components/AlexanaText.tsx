import React from "react";

type LetterProps = {
  char: string;
  color?: string;
  size: number; // px
};

const AlexanaLetter: React.FC<LetterProps> = ({ char, color = "currentColor", size }) => {
  if (char === " ") return <div style={{ width: size * 0.45 }} aria-hidden />;

  const common = {
    fill: "none" as const,
    stroke: color,
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    style: {
      height: size,
      width: size,
      filter: "drop-shadow(0 0 10px rgba(0,255,136,0.25))",
      flexShrink: 0,
    },
  };

  const dot = (cx: number, cy: number) => (
    <circle cx={cx} cy={cy} r={1.5} stroke="none" fill={color} />
  );

  const content = (() => {
    switch (char.toUpperCase()) {
      case "V":
        return (<><path d="M 5 5 L 12 19 L 19 5" />{dot(12, 5)}</>);
      case "A":
        return (<><path d="M 12 2 L 20 20" /><path d="M 12 2 L 4 20" /><path d="M 8 12 L 16 12" />{dot(4, 20)}</>);
      case "L":
        return (<><path d="M 4 2 L 4 20" /><path d="M 4 20 L 20 20" />{dot(20, 20)}</>);
      case "H":
        return (<><path d="M 4 2 L 4 22" /><path d="M 20 2 L 20 22" /><path d="M 4 12 L 20 12" />{dot(20, 4)}</>);
      case "S":
        return (<><path d="M 20 4 L 10 4 Q 4 4 4 10 Q 4 14 12 14 Q 20 14 20 18 Q 20 22 10 22 L 4 22" />{dot(4, 22)}</>);
      case "O":
        return (<><circle cx="12" cy="12" r="10" />{dot(5, 5)}</>);
      case "C":
        return (<><path d="M 20 6 A 10 10 0 0 0 12 2 A 10 10 0 0 0 12 22 A 10 10 0 0 0 20 18" />{dot(20, 22)}</>);
      case "P":
        return (<><path d="M 4 2 L 4 22" /><path d="M 4 2 L 14 2 A 6 6 0 0 1 14 14 L 4 14" />{dot(4, 2)}</>);
      case "R":
        return (<><path d="M 4 2 L 4 22" /><path d="M 4 2 L 14 2 A 6 6 0 0 1 14 14 L 4 14" /><path d="M 10 14 L 18 22" />{dot(4, 2)}</>);
      default:
        return (
          <text
            x="12"
            y="19"
            textAnchor="middle"
            fill={color}
            stroke="none"
            fontSize="20"
            fontFamily="'Bebas Neue', sans-serif"
          >
            {char}
          </text>
        );
    }
  })();

  return <svg {...common}>{content}</svg>;
};

type WordProps = { word: string; size: number; color?: string };
const AlexanaWord: React.FC<WordProps> = ({ word, size, color }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.05 }}>
    {word.split("").map((c, i) => (
      <AlexanaLetter key={i} char={c} size={size} color={color} />
    ))}
  </span>
);

type TextProps = {
  text: string;
  size?: number;
  color?: string;
  wordGap?: number;
  className?: string;
  wordColors?: Record<string, string>;
};

export const AlexanaText: React.FC<TextProps> = ({
  text,
  size = 80,
  color = "currentColor",
  wordGap,
  className,
  wordColors,
}) => {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: wordGap ?? size * 0.5,
        lineHeight: 1,
      }}
    >
      {words.map((w, i) => (
        <AlexanaWord key={i} word={w} size={size} color={wordColors?.[w.toUpperCase()] ?? color} />
      ))}
    </span>
  );
};

export default AlexanaText;