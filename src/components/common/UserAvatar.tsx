import { useState } from "react";
import { cn } from "../../lib/utils";

export function UserAvatar({
  name,
  src,
  className,
  size = 40,
}: {
  name: string;
  src?: string | null;
  className?: string;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const showImage = !!src && !imgError;

  if (showImage) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className={cn("shrink-0 rounded-full object-cover bg-muted", className)}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground",
        className,
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
