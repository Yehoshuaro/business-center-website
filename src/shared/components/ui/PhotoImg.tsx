import { useState } from 'react';
import { cn } from '@/shared/utils';

interface PhotoImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  /** Local image used when the remote source fails (offline, blocked, 404). */
  fallback?: string;
}

/**
 * <img> with a graceful degradation path: remote photo first, local SVG
 * placeholder second. Keeps every demo functional with no network at all.
 */
export const PhotoImg = ({ src, fallback, className, alt = '', ...rest }: PhotoImgProps) => {
  const [failed, setFailed] = useState(false);
  const finalSrc = failed && fallback ? fallback : src;

  return (
    <img
      {...rest}
      src={finalSrc}
      alt={alt}
      onError={() => {
        if (!failed && fallback) setFailed(true);
      }}
      className={cn('block', className)}
      draggable={false}
    />
  );
};
