import { describe, it, expect } from 'vitest';

describe('Frontend Component Tests', () => {
  it('should verify components and auth module exports', async () => {
    const authModule = await import('../context/AuthContext');
    expect(authModule.AuthProvider).toBeDefined();
    expect(authModule.useAuth).toBeDefined();
  });
});
