import { DB } from './db';
import { SyncControllerService } from '../api/generated';
import type { SyncChangeDto } from '../api/generated';

export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';

export interface SyncQueueItem {
    id: string; // unique uuid for the queue item
    entityType: 'aputrak_schedule' | 'tags' | 'aputrak_settings' | 'profile';
    entityId: string;
    operation: SyncOperation;
    data: any;
    timestamp: number;
}

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
        
        // Intentar sincronizar en segundo plano si hay internet
        if (typeof window !== 'undefined' && navigator.onLine) {
            SyncManager.pushMutations().catch(console.error);
        }
    }

    private static isPushing = false;
    private static isPulling = false;
    private static lastPush = 0;
    private static lastPull = 0;
    private static readonly SYNC_COOLDOWN_MS = 5000; // 5 seconds minimum between requests

    static async pushMutations() {
        if (this.isPushing) return;
        const now = Date.now();
        if (now - this.lastPush < this.SYNC_COOLDOWN_MS) return;
        
        this.isPushing = true;
        this.lastPush = now;

        try {
            const queue = await DB.getAll<SyncQueueItem>('sync_queue');
            if (queue.length === 0) {
                this.isPushing = false;
                return;
            }

            // Ordenar por timestamp
            queue.sort((a, b) => a.timestamp - b.timestamp);

            const mutations = queue.map(item => ({
                clientMutationId: item.id,
                entityType: item.entityType,
                entityId: item.entityId,
                operation: item.operation,
                payload: item.data as any,
            }));

            const response = await SyncControllerService.push({ mutations });
            
            // Si fue exitoso, eliminar procesados de la cola
            for (const item of queue) {
                // En IndexedDB nativo tenemos que usar transaction para borrar
                await DB.delete('sync_queue', item.id);
            }
        } catch (error) {
            console.error('Error pushing mutations:', error);
            // Quedarán en la cola para el próximo intento
        } finally {
            this.isPushing = false;
        }
    }

    static async pullUpdates() {
        if (this.isPulling) return;
        const now = Date.now();
        if (now - this.lastPull < this.SYNC_COOLDOWN_MS) return;

        this.isPulling = true;
        this.lastPull = now;

        try {
            // Ejemplo básico de pull
            const lastSync = localStorage.getItem('lastSyncCursor') || undefined;
            const response = await SyncControllerService.pull(
                lastSync, 
                100, 
                undefined, 
                ['aputrak_schedule', 'tags', 'aputrak_settings', 'profile']
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
                        await DB.put(storeName as any, change.payload as any);
                    }
                }
            }

            if (response.nextCursor) {
                localStorage.setItem('lastSyncCursor', response.nextCursor);
            }
        } catch (error) {
            console.error('Error pulling updates:', error);
        } finally {
            this.isPulling = false;
        }
    }
}
