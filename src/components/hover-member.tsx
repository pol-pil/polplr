"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeamMember {
  name: string;
  role: string;
  /** Path to member photo. If omitted, an initials placeholder is shown. */
  image?: string;
}

export interface HoverMemberProps {
  teamMembers: TeamMember[];
  /** Text shown when no member is hovered. Default: "The Team" */
  defaultName?: string;
  /** Background colour of the section. Default: "#0a0a0a" */
  backgroundColor?: string;
  /** Colour of the large idle name. Default: "#2a2a2a" */
  textColor?: string;
  /** Colour of the large active name. Default: "#ffffff" */
  hoverTextColor?: string;
  /** Colour of the custom cursor dot. Default: "#ffffff" */
  cursorColor?: string;
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Deterministic pastel from a string so initials colour is stable per member */
function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 30%, 55%)`;
}

// ─── Sub-component: animated name ────────────────────────────────────────────

interface AnimatedNameProps {
  text: string;
  color: string;
}

function AnimatedName({ text, color }: AnimatedNameProps) {
  const [chars, setChars] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => {
      setChars(text.split(""));
      // next frame so CSS transition fires
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, 40);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <span
      style={{
        display: "block",
        color,
        fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
        fontWeight: 700,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        textTransform: "uppercase",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {chars.map((ch, i) => (
        <span
          key={`${text}-${i}`}
          style={{
            display: "inline-block",
            transform: visible ? "translateY(0%)" : "translateY(110%)",
            opacity: visible ? 1 : 0,
            transition: `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.035}s,
                         opacity 0.3s ease ${i * 0.035}s`,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

// ─── Sub-component: member card ───────────────────────────────────────────────

interface MemberCardProps {
  member: TeamMember;
  onEnter: () => void;
  onLeave: () => void;
}

function MemberCard({ member, onEnter, onLeave }: MemberCardProps) {
  const [hovered, setHovered] = useState(false);
  const color = nameToColor(member.name);

  const handleEnter = () => {
    setHovered(true);
    onEnter();
  };
  const handleLeave = () => {
    setHovered(false);
    onLeave();
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        flex: "1 1 0",
        maxWidth: 160,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: hovered ? "translateY(-12px)" : "translateY(0px)",
        transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        zIndex: hovered ? 5 : 1,
        position: "relative",
        cursor: "none",
      }}
    >
      {/* Image / Placeholder */}
      <div
        style={{
          width: "100%",
          aspectRatio: "3 / 4",
          borderRadius: "8px 8px 0 0",
          overflow: "hidden",
          background: "#1a1a1a",
        }}
      >
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              filter: hovered
                ? "grayscale(0%) brightness(1)"
                : "grayscale(100%) brightness(0.65)",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "filter 0.4s ease, transform 0.4s ease",
            }}
          />
        ) : (
          /* Initials placeholder — remove when using real images */
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: 12,
              background: "#111",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "75%",
                height: "88%",
                borderRadius: "50% 50% 0 0",
                background: color,
                opacity: hovered ? 0.45 : 0.2,
                transition: "opacity 0.4s ease",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: hovered ? "#aaa" : "#444",
                letterSpacing: "0.05em",
                position: "relative",
                zIndex: 1,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                transition: "color 0.3s ease",
              }}
            >
              {getInitials(member.name)}
            </span>
          </div>
        )}
      </div>

      {/* Role label */}
      <p
        style={{
          fontSize: 11,
          color: hovered ? "#888" : "#555",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          marginTop: 8,
          fontWeight: 500,
          textAlign: "center",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          transition: "color 0.3s ease",
        }}
      >
        {member.role}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HoverMember({
  teamMembers,
  defaultName = "The Team",
  backgroundColor = "#0a0a0a",
  textColor = "#2a2a2a",
  hoverTextColor = "#ffffff",
  cursorColor = "#ffffff",
  className,
}: HoverMemberProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Cursor
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorExpanded, setCursorExpanded] = useState(false);
  const targetPos = useRef({ x: 0, y: 0 });
  const animRef = useRef<number>(0);

  // Active member
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);
  // Key forces AnimatedName to remount when same member re-hovered
  const [nameKey, setNameKey] = useState(0);

  // Smooth cursor RAF loop
  useEffect(() => {
    const tick = () => {
      setCursorPos((prev) => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.15,
        y: prev.y + (targetPos.current.y - prev.y) * 0.15,
      }));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMemberEnter = useCallback((member: TeamMember) => {
    setActiveMember(member);
    setNameKey((k) => k + 1);
    setCursorExpanded(true);
  }, []);

  const handleMemberLeave = useCallback(() => {
    setActiveMember(null);
    setNameKey((k) => k + 1);
    setCursorExpanded(false);
  }, []);

  const displayText = activeMember ? activeMember.name : defaultName;
  const displayColor = activeMember ? hoverTextColor : textColor;

  return (
    <div
      ref={rootRef}
      onMouseMove={handleMouseMove}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        minHeight: 520,
        background: backgroundColor,
        overflow: "hidden",
        cursor: "none",
        userSelect: "none",
      }}
    >
      {/* Custom cursor */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: cursorPos.x,
          top: cursorPos.y,
          width: cursorExpanded ? 40 : 10,
          height: cursorExpanded ? 40 : 10,
          background: cursorColor,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          transition: "width 0.2s ease, height 0.2s ease",
          zIndex: 100,
          mixBlendMode: "difference",
        }}
      />

      {/* Central name */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
          zIndex: 10,
          width: "90%",
        }}
      >
        <AnimatedName key={nameKey} text={displayText} color={displayColor} />

        <p
          style={{
            fontSize: 11,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: activeMember ? "#666" : "#444",
            marginTop: 8,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            transition: "color 0.3s ease",
          }}
        >
          {activeMember ? activeMember.role : "Hover to reveal"}
        </p>
      </div>

      {/* Member strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          padding: "0 2rem 2.5rem",
          alignItems: "flex-end",
          gap: 0,
        }}
      >
        {teamMembers.map((member) => (
          <MemberCard
            key={member.name}
            member={member}
            onEnter={() => handleMemberEnter(member)}
            onLeave={handleMemberLeave}
          />
        ))}
      </div>
    </div>
  );
}

export default HoverMember;

// ─── Usage example ────────────────────────────────────────────────────────────
//
// import { HoverMember } from "@/components/HoverMember";
//
// const team = [
//   { name: "Alex Chen",   role: "Creative Director", image: "/images/alex.jpg"   },
//   { name: "Sam Rivera",  role: "Lead Designer",     image: "/images/sam.jpg"    },
//   { name: "Jordan Lee",  role: "Art Director",      image: "/images/jordan.jpg" },
//   { name: "Morgan Kim",  role: "Developer",         image: "/images/morgan.jpg" },
//   { name: "Taylor Park", role: "Strategist",        image: "/images/taylor.jpg" },
// ];
//
// export default function Page() {
//   return <HoverMember teamMembers={team} />;
// }
