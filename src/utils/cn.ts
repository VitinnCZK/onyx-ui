export type ClassValue = string | number | false | null | undefined | readonly ClassValue[];

/**
 * Merges class names, skipping falsy values and flattening nested arrays.
 *
 * @example
 * cn('button', isActive && 'button--active', className);
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input && input !== 0) continue;

    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else {
      classes.push(String(input));
    }
  }

  return classes.join(' ');
}
