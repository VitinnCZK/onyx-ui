import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * `text` matches a line of the surrounding text, `rect` a block and `circle` an avatar.
   * @default 'text'
   */
  variant?: 'text' | 'rect' | 'circle';
  /** CSS width. Numbers are pixels. Lines of text fill the container by default. */
  width?: CSSProperties['width'];
  /** CSS height. Numbers are pixels. Ignored by text, which takes the line height. */
  height?: CSSProperties['height'];
  /**
   * Lines of text to draw; the last one is shorter.
   * @default 1
   */
  lines?: number;
}

/**
 * Placeholder shaped like content that is still loading. It is hidden from assistive technology:
 * mark the region that is loading with `aria-busy` and announce the outcome elsewhere.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, lines = 1, className, style, ...props },
  ref,
) {
  const shapeStyle: CSSProperties = {
    width,
    height: variant === 'text' ? undefined : height,
    ...style,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn(styles.lines, className)}
        style={{ width, ...style }}
        {...props}
      >
        {Array.from({ length: lines }, (_, index) => (
          <span key={index} className={cn(styles.skeleton, styles.text)} />
        ))}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(styles.skeleton, styles[variant], className)}
      style={shapeStyle}
      {...props}
    />
  );
});
