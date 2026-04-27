import { describe, it, expect } from 'vitest';
import { isManagerOrAdmin } from './permissions';

describe('permissions', () => {
  it('allows ADMIN', () => {
    expect(isManagerOrAdmin('ADMIN')).toBe(true);
  });

  it('allows MANAGER', () => {
    expect(isManagerOrAdmin('MANAGER')).toBe(true);
  });

  it('denies MEMBER', () => {
    expect(isManagerOrAdmin('MEMBER')).toBe(false);
  });
});
