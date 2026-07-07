import { vi } from 'vitest';
import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock('@/shared/lib/db', () => ({
  DB: {
    get: vi.fn(),
    put: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
    getDb: vi.fn().mockResolvedValue({
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          getAll: vi.fn().mockImplementation(() => {
            const req = { onsuccess: null, onerror: null, result: [] };
            setTimeout(() => {
              if (req.onsuccess) (req as any).onsuccess();
            }, 0);
            return req;
          })
        })
      })
    }),
  }
}));

vi.mock('@/shared/lib/sync', () => ({
  SyncManager: {
    queueMutation: vi.fn(),
    syncQueue: vi.fn(),
    init: vi.fn(),
  }
}));
