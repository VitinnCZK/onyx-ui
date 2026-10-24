import { forwardRef, type CSSProperties, type ElementType } from 'react';
import { cn } from '@/utils/cn';
import type {
  PolymorphicComponent,
  PolymorphicProps,
  PolymorphicPropsWithRef,
} from '@/utils/polymorphic';
import styles from './Text.module.css';

export type TextSize = 'inherit' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextTone =
  'default' | 'muted' | 'inherit' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface TextOwnProps {
  /** @default 'md' */
  size?: TextSize;
  /** Defaults to the weight of the surrounding text. */
  weight?: TextWeight;
  /** @default 'default' */
  tone?: TextTone;
  align?: 'start' | 'center' | 'end';
  /**
   * `true` cuts the text to one line with an ellipsis; a number clamps it to that many lines.
   * @default false
   */
  truncate?: boolean | number;
}

const sizeClasses: Record<TextSize, string | undefined> = {
  inherit: styles.sizeInherit,
  xs: styles.sizeXs,
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
};

const toneClasses: Record<TextTone, string | undefined> = {
  default: styles.toneDefault,
  muted: styles.toneMuted,
  inherit: styles.toneInherit,
  primary: styles.tonePrimary,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  info: styles.toneInfo,
};

export type TextProps<As extends ElementType = 'p'> = PolymorphicPropsWithRef<As, TextOwnProps>;

/** Body text. Renders a paragraph by default; use `as` for inline text or other elements. */
export const Text = forwardRef<HTMLParagraphElement, PolymorphicProps<'p', TextOwnProps>>(
  function Text(
    {
      as: Component = 'p',
      size = 'md',
      weight,
      tone = 'default',
      align,
      truncate = false,
      className,
      style,
      ...props
    },
    ref,
  ) {
    const lines = typeof truncate === 'number' ? truncate : undefined;

    return (
      <Component
        ref={ref}
        className={cn(
          styles.text,
          sizeClasses[size],
          weight && styles[weight],
          toneClasses[tone],
          align && styles[align],
          truncate === true && styles.truncate,
          lines !== undefined && styles.clamp,
          className,
        )}
        style={lines === undefined ? style : ({ '--text-lines': lines, ...style } as CSSProperties)}
        {...props}
      />
    );
  },
) as PolymorphicComponent<'p', TextOwnProps>;
