"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DB } from "@/shared/lib/db";
import { SyncManager } from "@/shared/lib/sync";
import { DEFAULT_ACTIVITY_TAGS, GENERAL_TAG_ID } from "../constants/tags.constants";
import type { ActivityTag } from "../types/tag.types";

import { COLOR_MAP, DEFAULT_TASK_COLOR } from "@/shared/lib/constants";

const TAGS_RECORD_ID = "activity-tags";
const REFRESH_INTERVAL_MS = 30_000;

function normalizeColor(color: string) {
    if (!color) return COLOR_MAP[DEFAULT_TASK_COLOR];
    const trimmed = color.trim().toLowerCase();
    if (COLOR_MAP[trimmed]) return COLOR_MAP[trimmed];
    if (trimmed.startsWith("#")) return color.trim();
    return `#${color.trim()}`;
}

function normalizeTags(tags: ActivityTag[]) {
    const list = tags.length > 0 ? tags : DEFAULT_ACTIVITY_TAGS;
    return list.map(tag => ({
        ...tag,
        color: normalizeColor(tag.color)
    }));
}

async function loadTagsFromDB(): Promise<ActivityTag[]> {
    const db = await DB.getDb();
    const tx = db.transaction("tags", "readonly");
    const store = tx.objectStore("tags");
    const allRequest = store.getAll();

    return new Promise((resolve) => {
        allRequest.onsuccess = () => {
            const allRecords = allRequest.result as any[];
            const aggregatedRecord = allRecords.find((r: any) => r.id === TAGS_RECORD_ID);
            const individualTags: ActivityTag[] = allRecords
                .filter((r: any) => r.id !== TAGS_RECORD_ID && r.name && r.color)
                .map((r: any) => ({
                    id: String(r.id),
                    name: r.name,
                    color: r.color || "#6366F1",
                    icon: r.icon || "Tag",
                }));

            const baseTags: ActivityTag[] = aggregatedRecord?.data ?? DEFAULT_ACTIVITY_TAGS;

            const seen = new Set<string>();
            const deduped: ActivityTag[] = [];
            for (const tag of [...baseTags, ...individualTags]) {
                if (!seen.has(tag.id)) {
                    seen.add(tag.id);
                    deduped.push(tag);
                }
            }

            resolve(normalizeTags(deduped));
        };
        allRequest.onerror = () => resolve(DEFAULT_ACTIVITY_TAGS);
    });
}

export function useActivityTags() {
    const [tags, setTags] = useState<ActivityTag[]>(DEFAULT_ACTIVITY_TAGS);
    const [loadingTags, setLoadingTags] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const refreshTags = useCallback(async () => {
        try {
            const merged = await loadTagsFromDB();
            setTags(merged);
        } catch (error) {
            console.error("Error refreshing tags:", error);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadTags = async () => {
            try {
                const merged = await loadTagsFromDB();

                if (!cancelled) {
                    setTags(merged);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (!cancelled) {
                    setLoadingTags(false);
                }
            }
        };

        loadTags();

        intervalRef.current = setInterval(() => {
            if (!cancelled) refreshTags();
        }, REFRESH_INTERVAL_MS);

        return () => {
            cancelled = true;
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [refreshTags]);

    const persistTags = async (nextTags: ActivityTag[]) => {
        const normalizedTags = normalizeTags(nextTags);

        setTags(normalizedTags);

        const dataToSave = {
            id: TAGS_RECORD_ID,
            data: normalizedTags,
        };
        await DB.put("tags", dataToSave);

        const tagsToSync = normalizedTags.filter(t => t.id !== GENERAL_TAG_ID);
        for (const tag of tagsToSync) {
            await SyncManager.queueMutation('tags', tag.id, 'UPDATE', {
                id: tag.id,
                name: tag.name,
                color: tag.color,
                icon: tag.icon,
            });
        }
    };

    const saveTag = async (tag: ActivityTag) => {
        const exists = tags.some((item) => item.id === tag.id);

        const nextTags = exists
            ? tags.map((item) => (item.id === tag.id ? tag : item))
            : [...tags, tag];

        await persistTags(nextTags);
    };

    const deleteTag = async (tagId: string) => {
        const nextTags = tags.filter((item) => item.id !== tagId);

        setTags(normalizeTags(nextTags));

        const dataToSave = {
            id: TAGS_RECORD_ID,
            data: normalizeTags(nextTags),
        };
        await DB.put("tags", dataToSave);

        await SyncManager.queueMutation('tags', tagId, 'DELETE', { id: tagId });
    };

    return {
        tags,
        loadingTags,
        saveTag,
        deleteTag,
        refreshTags,
    };
}