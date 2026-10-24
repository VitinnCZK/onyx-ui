import { forwardRef, type SVGProps } from 'react';
import { cn } from '@/utils/cn';
import styles from './Icon.module.css';

export type IconSize = 'inherit' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /**
   * Accessible name. Without it the icon is decorative and hidden from assistive technology,
   * so the surrounding text or control must carry the meaning.
   */
  label?: string;
  /**
   * `inherit` follows the font size of the surrounding text.
   * @default 'inherit'
   */
  size?: IconSize;
}

/** Renders a 24×24 stroke icon. Pass the shapes as children, or use one of the built-in icons. */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { label, size = 'inherit', className, children, ...props },
  ref,
) {
  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(styles.icon, styles[size], className)}
      {...props}
    >
      {children}
    </svg>
  );
});
