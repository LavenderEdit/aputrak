const DB_NAME = "AputrakDB";
const DB_VERSION = 4;

type StoreName = "profile" | "settings" | "weeks" | "tags" | "boards" | "sync_queue";

type StoredRecord = {
    id: string;
};

const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(new Error("Error opening DB"));

        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = request.result;
            const oldVersion = event.oldVersion;

            if (!db.objectStoreNames.contains("profile")) {
                db.createObjectStore("profile", { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains("settings")) {
                db.createObjectStore("settings", { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains("weeks")) {
                db.createObjectStore("weeks", { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains("tags")) {
                db.createObjectStore("tags", { keyPath: "id" });
            }
            
            if (!db.objectStoreNames.contains("sync_queue")) {
                const store = db.createObjectStore("sync_queue", { keyPath: "id" });
                store.createIndex("timestamp", "timestamp", { unique: false });
            }

            if (!db.objectStoreNames.contains("boards")) {
                db.createObjectStore("boards", { keyPath: "id" });
            }
        };
    });
};

export const DB = {
    get: async <T = unknown>(
        storeName: StoreName,
        id: string,
    ): Promise<T | undefined> => {
        const db = await initDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result as T | undefined);
            request.onerror = () => reject(request.error);
        });
    },

    put: async <T extends StoredRecord>(
        storeName: StoreName,
        data: T,
    ): Promise<void> => {
        const db = await initDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    getAll: async <T = unknown>(storeName: StoreName): Promise<T[]> => {
        const db = await initDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as T[]);
            request.onerror = () => reject(request.error);
        });
    },

    delete: async (storeName: StoreName, id: string): Promise<void> => {
        const db = await initDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    getDb: async () => {
        return await initDB();
    }
};