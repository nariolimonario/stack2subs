import Image from "next/image";
import { useMemo } from "react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TrustedBy({
  avatars,
  show = 6,
  label = "1,200+ creators growing with Stack2Subs",
}: {
  avatars: string[];
  show?: number;
  label?: string;
}) {
  const faces = useMemo(() => shuffle(avatars).slice(0, show), [avatars, show]);

  return (
    <div className="avatar-bar" aria-label="Social proof">
      <div className="avatar-pile" aria-hidden="true">
        {faces.map((src, i) => (
          <span
            key={src + i}
            className="avatar overlap"
            style={{ zIndex: faces.length - i }}
          >
            <Image src={src} alt="" width={36} height={36} />
          </span>
        ))}
      </div>

      <span className="avatar-text">{label}</span>
    </div>
  );
}
