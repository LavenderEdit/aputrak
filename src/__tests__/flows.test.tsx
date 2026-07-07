import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBoardState } from '@/features/board/hooks/useBoardState';
import { useActivityTags } from '@/features/tags/hooks/useActivityTags';
import { useOfflineSchedule } from '@/features/schedule/hooks/useOfflineSchedule';
import { DB } from '@/shared/lib/db';

// Mock DB
vi.mock('@/shared/lib/db', () => {
  return {
    DB: {
      get: vi.fn(),
      put: vi.fn(),
      getAll: vi.fn(),
      delete: vi.fn(),
      getDb: vi.fn(),
    }
  };
});

describe('Aputrak Workflows', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Flow 2: Board State Management (Kanban)', () => {
    it('loads boards from DB on mount', async () => {
      const mockBoards = [{ id: 'board_1', title: 'Test Board', lists: [] }];
      vi.mocked(DB.getAll).mockResolvedValueOnce(mockBoards);

      const { result } = renderHook(() => useBoardState());

      // Initial state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.boards).toEqual([]);

      // Wait for async load
      await vi.waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.boards).toEqual(mockBoards);
      expect(result.current.activeBoardId).toBe('board_1');
      expect(DB.getAll).toHaveBeenCalledWith('boards');
    });

    it('creates a new board', async () => {
      vi.mocked(DB.getAll).mockResolvedValueOnce([]);
      
      const { result } = renderHook(() => useBoardState());
      
      await vi.waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let newBoard;
      await act(async () => {
        newBoard = await result.current.createBoard('New Kanban');
      });

      expect(newBoard).toBeDefined();
      expect(newBoard?.title).toBe('New Kanban');
      expect(result.current.boards).toHaveLength(1);
      expect(result.current.boards[0].title).toBe('New Kanban');
      expect(result.current.activeBoardId).toBe(newBoard?.id);
      expect(DB.put).toHaveBeenCalledWith('boards', expect.objectContaining({ title: 'New Kanban' }));
    });
  });

  describe('Flow 3: Tags Management', () => {
    it('loads tags from DB (returns default)', async () => {
      const { result } = renderHook(() => useActivityTags());

      await vi.waitFor(() => {
        expect(result.current.loadingTags).toBe(false);
      });

      expect(result.current.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'general', name: 'General' })
        ])
      );
    });

    it('creates a new tag', async () => {
      vi.mocked(DB.getAll).mockResolvedValueOnce([]);
      
      const { result } = renderHook(() => useActivityTags());
      
      await vi.waitFor(() => {
        expect(result.current.loadingTags).toBe(false);
      });

      await act(async () => {
        await result.current.saveTag({ id: 'tag_2', name: 'Personal', color: '#00ff00', icon: 'Tag' });
      });

      expect(result.current.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Personal' })
        ])
      );
      expect(DB.put).toHaveBeenCalledWith('tags', expect.objectContaining({ data: expect.any(Array) }));
    });
  });

  describe('Flow 4: Schedule State (Offline Schedule)', () => {
    it('loads tasks and settings from DB', async () => {
      const mockSettings = { activeDays: 5, startHour: 8, endHour: 18 };
      vi.mocked(DB.get).mockImplementation(async (store) => {
        if (store === 'settings') return { id: 'global', ...mockSettings };
        if (store === 'weeks') return { id: 'week_1', data: [] };
        return undefined;
      });

      const { result } = renderHook(() => useOfflineSchedule());

      await vi.waitFor(() => {
        expect(result.current.loadingData).toBe(false);
      });

      expect(result.current.settings).toEqual(expect.objectContaining(mockSettings));
      expect(result.current.tasks).toEqual([]);
    });

    it('saves a new task', async () => {
      vi.mocked(DB.get).mockResolvedValueOnce(undefined);
      
      const { result } = renderHook(() => useOfflineSchedule());
      
      await vi.waitFor(() => {
        expect(result.current.loadingData).toBe(false);
      });

      await act(async () => {
        await result.current.saveTask({
          id: 'temp_id',
          text: 'New Task',
          day: 1,
          startMinute: 600,
          endMinute: 660,
          tagId: 'general',
          color: '#000',
          completed: [false],
        });
      });

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].text).toBe('New Task');
      expect(DB.put).toHaveBeenCalledWith('weeks', expect.objectContaining({ data: expect.any(Array) }));
    });
  });

  describe('Flow 5: Smart Rescheduling (Schedule Engine)', () => {
    it('handles smart reschedule with no tasks to move', async () => {
      vi.mocked(DB.get).mockResolvedValueOnce(undefined);
      
      const { result } = renderHook(() => useOfflineSchedule());
      
      await vi.waitFor(() => {
        expect(result.current.loadingData).toBe(false);
      });

      let response;
      await act(async () => {
        response = await result.current.smartReschedule();
      });

      expect(response).toEqual({ success: false, reason: 'no-tasks' });
    });
  });
});
