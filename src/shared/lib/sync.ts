import { DB } from './db';
import { SyncControllerService } from '../api/generated';
import type { SyncChangeDto } from '../api/generated';
import { tryRefreshToken, clearAuthTokens } from './tokenRefresh';

export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';

export interface SyncQueueItem {
    id: string;
    entityType: 'aputrak_schedule' | 'tags' | 'aputrak_settings' | 'profile';
    entityId: string;
    operation: SyncOperation;
    data: any;
    timestamp: number;
}

const MAX_RETRIES = 5;
const BACKOFF_BASE_MS = 10_000;

export class SyncManager {
    static async queueMutation(
        entityType: SyncQueueItem['entityType'],
        entityId: string,
        operation: SyncOperation,
        data: any
    ) {
        const item: SyncQueueItem = {
            id: crypto.randomUUID(),
            entityType,
            entityId,
            operation,
            data,
            timestamp: Date.now(),
        };

        await DB.put('sync_queue', item);
        
        if (typeof window !== 'undefined' && navigator.onLine) {
            SyncManager.pushMutations().catch(() => {});
        }
    }

    private static isPushing = false;
    private static isPulling = false;
    private static lastPush = 0;
    private static lastPull = 0;
    private static failCount = 0;
    private static readonly SYNC_COOLDOWN_MS = 5000;

    private static getBackoffMs(): number {
        return Math.min(BACKOFF_BASE_MS * Math.pow(2, this.failCount), 5 * 60 * 1000);
    }

    static async pushMutations() {
        if (this.isPushing) return;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        const now = Date.now();
        const cooldown = this.failCount > 0 ? this.getBackoffMs() : this.SYNC_COOLDOWN_MS;
        if (now - this.lastPush < cooldown) return;
        
        this.isPushing = true;
        this.lastPush = now;

        try {
            await this._doPush();
            this.failCount = 0;
        } catch (error: any) {
            this.failCount++;
            const status = error?.status || error?.response?.status;
            if (status === 401 || status === 500) {
                const refreshed = await tryRefreshToken();
                if (refreshed) {
                    try { await this._doPush(); this.failCount = 0; } catch {}
                } else {
                    clearAuthTokens();
                }
            }
        } finally {
            this.isPushing = false;
        }
    }

    private static async _doPush() {
        const queue = await DB.getAll<SyncQueueItem>('sync_queue');
        if (queue.length === 0) return;

        queue.sort((a, b) => a.timestamp - b.timestamp);

        const mutations = queue.map(item => ({
            clientMutationId: item.id,
            entityType: item.entityType,
            entityId: item.entityId,
            operation: item.operation,
            payload: item.data as any,
        }));

        const response = await SyncControllerService.push({ mutations });

        const failedIds = new Set<string>();
        if (response && typeof response === 'object' && 'results' in response) {
            for (const result of (response as any).results || []) {
                if (result.error || result.status === 'error' || result.status === 'failed') {
                    failedIds.add(result.clientMutationId);
                }
            }
        }

        for (const item of queue) {
            if (failedIds.has(item.id)) {
                const updated: SyncQueueItem = { ...item, timestamp: Date.now() };
                await DB.put('sync_queue', updated);
            } else {
                await DB.delete('sync_queue', item.id);
            }
        }
    }

    static async pullUpdates() {
        if (this.isPulling) return;
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        const now = Date.now();
        const cooldown = this.failCount > 0 ? this.getBackoffMs() : this.SYNC_COOLDOWN_MS;
        if (now - this.lastPull < cooldown) return;

        this.isPulling = true;
        this.lastPull = now;

        try {
            await this._doPull();
            this.failCount = 0;
        } catch (error: any) {
            this.failCount++;
            const status = error?.status || error?.response?.status;
            if (status === 401 || status === 500) {
                const refreshed = await tryRefreshToken();
                if (refreshed) {
                    try { await this._doPull(); this.failCount = 0; } catch {}
                } else {
                    clearAuthTokens();
                }
            } else if (status === 500) {
                if (typeof window !== 'undefined') localStorage.removeItem('lastSyncCursor');
            }
        } finally {
            this.isPulling = false;
        }
    }

    private static async _doPull() {
        const lastSync = localStorage.getItem('lastSyncCursor') || undefined;
        const response = await SyncControllerService.pull(
            lastSync, 
            100, 
            undefined, 
            ['aputrak_schedule', 'tags', 'aputrak_settings']
        );

        if (response.changes && response.changes.length > 0) {
            for (const change of response.changes) {
                if (!change.entityId || !change.entityType) continue;

                let storeName = '';
                if (change.entityType === 'aputrak_schedule') storeName = 'weeks';
                else if (change.entityType === 'tags') storeName = 'tags';
                else if (change.entityType === 'aputrak_settings') storeName = 'settings';
                else if (change.entityType === 'profile') storeName = 'profile';

                if (!storeName) continue;

                if (change.operation === 'DELETE') {
                    await DB.delete(storeName as any, change.entityId);
                } else if (change.payload) {
                    const dataToSave = { ...(change.payload as any), id: change.entityId };
                    await DB.put(storeName as any, dataToSave);
                }
            }
        }

        if (response.nextCursor) {
            localStorage.setItem('lastSyncCursor', response.nextCursor);
        }
    }

    static resetState() {
        this.failCount = 0;
        this.lastPush = 0;
        this.lastPull = 0;
        this.isPushing = false;
        this.isPulling = false;
    }
}
