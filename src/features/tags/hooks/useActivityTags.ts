"use client";

import { useEffect, useState } from "react";
import { DB } from "@/shared/lib/db";
import { DEFAULT_ACTIVITY_TAGS } from "../constants/tags.constants";
import type { ActivityTag } from "../types/tag.types";

const TAGS_RECORD_ID = "activity-tags";

interface StoredActivityTags {
    id: string;
    data: ActivityTag[];
}

function normalizeTags(tags: ActivityTag[]) {
    return tags.length > 0 ? tags : DEFAULT_ACTIVITY_TAGS;
}

export function useActivityTags() {
    const [tags, setTags] = useState<ActivityTag[]>(DEFAULT_ACTIVITY_TAGS);
    const [loadingTags, setLoadingTags] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const loadTags = async () => {
            try {
                const stored = await DB.get<StoredActivityTags>(
                    "tags",
                    TAGS_RECORD_ID,
                );

                const nextTags = normalizeTags(stored?.data ?? []);

                if (!stored?.data) {
                    await DB.put("tags", {
                        id: TAGS_RECORD_ID,
                        data: nextTags,
                    });
                }

                if (!cancelled) {
                    setTags(nextTags);
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

        return () => {
            cancelled = true;
        };
    }, []);

    const persistTags = async (nextTags: ActivityTag[]) => {
        const normalizedTags = normalizeTags(nextTags);

        setTags(normalizedTags);

        await DB.put("tags", {
            id: TAGS_RECORD_ID,
            data: normalizedTags,
        });
    };

    const saveTag = async (tag: ActivityTag) => {
        const exists = tags.some((item) => item.id === tag.id);

        const nextTags = exists
            ? tags.map((item) => (item.id === tag.id ? tag : item))
            : [...tags, tag];

        await persistTags(nextTags);
    };

    const deleteTag = async (tagId: string) => {
        const nextTags = tags.filter((tag) => tag.id !== tagId);

        await persistTags(nextTags);
    };

    return {
        tags,
        loadingTags,
        saveTag,
        deleteTag,
    };
}