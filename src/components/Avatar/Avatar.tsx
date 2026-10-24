import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Name of the person or entity. Names the avatar and provides the initials fallback. */
  name: string;
  /** Image URL. The initials show while it is missing or fails to load. */
  src?: string;
  /** Alternative text of the image. @default name */
  alt?: string;
  /** @default 'md' */
  size?: AvatarSize;
  /** @default 'circle' */
  shape?: 'circle' | 'square';
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? [words[0], words.at(-1)] : [words[0]];

  return letters
    .map((word) => (word ? String.fromCodePoint(word.codePointAt(0)!) : ''))
    .join('')
    .toUpperCase();
}

/** Picture of a person or entity, with their initials as a fallback. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, alt = name, size = 'md', shape = 'circle', className, ...props },
  ref,
) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = src !== undefined && src !== failedSrc;

  return (
    <span
      ref={ref}
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : name}
      className={cn(styles.avatar, styles[size], styles[shape], className)}
      {...props}
    >
      {showImage ? (
        <img className={styles.image} src={src} alt={alt} onError={() => setFailedSrc(src)} />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
});
