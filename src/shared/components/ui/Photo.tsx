import { useState } from 'react';
import { photo as resolvePhoto, type PhotoKey } from '@/shared/photos';
import { cn } from '@/shared/utils';

interface PhotoProps {
  name: PhotoKey | string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Optional overlay for hero/cards. */
  overlay?: boolean;
}

/**
 * Renders a curated photo by key with an automatic local SVG fallback if the
 * remote image fails to load (offline / firewalled demos keep working).
 */
export const Photo = ({ name, alt, className, imgClassName, overlay }: PhotoProps) => {
  const entry = resolvePhoto(name as PhotoKey);
  const [src, setSrc] = useState(entry.src);

  return (
    <div className={cn('relative overflow-hidden bg-surface-3', className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => entry.fallback && src !== entry.fallback && setSrc(entry.fallback)}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />}
    </div>
  );
};
