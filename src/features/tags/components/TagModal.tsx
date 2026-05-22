"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { getTagsCopy } from "../constants/tags.constants";
import type { ActivityTag } from "../types/tag.types";

interface TagModalProps {
    isOpen: boolean;
    tag: ActivityTag | null;
    lang: string;
    onClose: () => void;
    onSave: (tag: ActivityTag) => void;
}

interface TagFormProps {
    tag: ActivityTag | null;
    lang: string;
    onClose: () => void;
    onSave: (tag: ActivityTag) => void;
}

const colors = ["#6366F1", "#14B8A6", "#EC4899", "#F59E0B", "#8B5CF6"];

function createTagId() {
    return `tag_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function TagForm({ tag, lang, onClose, onSave }: TagFormProps) {
    const copy = getTagsCopy(lang);

    const [name, setName] = useState(tag?.name ?? "");
    const [color, setColor] = useState(tag?.color ?? colors[0]);

    return (
        <form
            className="space-y-5 p-6"
            onSubmit={(event) => {
                event.preventDefault();

                const cleanName = name.trim();

                if (!cleanName) return;

                onSave({
                    id: tag?.id ?? createTagId(),
                    name: cleanName,
                    color,
                    icon: tag?.icon ?? "Tag",
                });
            }}
        >
            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    {copy.tagName}
                </label>

                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-sborder px-3 py-2.5 text-sm outline-none transition focus:border-primary"
                    required
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    {copy.color}
                </label>

                <div className="flex gap-2">
                    {colors.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setColor(item)}
                            className={`h-9 w-9 rounded-full transition ${color === item
                                ? "scale-110 ring-2 ring-primary ring-offset-2"
                                : ""
                                }`}
                            style={{ backgroundColor: item }}
                            aria-label={item}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                    {copy.cancel}
                </Button>

                <Button type="submit">{copy.save}</Button>
            </div>
        </form>
    );
}

export function TagModal({
    isOpen,
    tag,
    lang,
    onClose,
    onSave,
}: TagModalProps) {
    const copy = getTagsCopy(lang);
    const title = tag ? copy.editTag : copy.addTag;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <TagForm
                key={tag?.id ?? "new-tag"}
                tag={tag}
                lang={lang}
                onClose={onClose}
                onSave={onSave}
            />
        </Modal>
    );
}