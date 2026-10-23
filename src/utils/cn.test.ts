import { describe, expect, it } from 'vitest';
import { cn } from '@/utils/cn';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('skips falsy values but keeps 0', () => {
    expect(cn('a', false, null, undefined, '', 0)).toBe('a 0');
  });

  it('flattens nested arrays', () => {
    expect(cn('a', ['b', ['c', false]], [])).toBe('a b c');
  });
});
