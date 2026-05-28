"use client";

import { useState } from "react";
import { Check, Palette, Tag } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { cn } from "@/shared/lib/cn";
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

const presetColors = ["#6366F1", "#14B8A6", "#EC4899", "#F59E0B"];
const defaultCustomColor = "#8B5CF6";

function createTagId() {
    return `tag_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeHex(value: string) {
    const cleanValue = value.trim().toUpperCase();

    if (!cleanValue) return defaultCustomColor;
    if (cleanValue.startsWith("#")) return cleanValue;

    return `#${cleanValue}`;
}

function isPresetColor(color: string) {
    return presetColors.some(
        (item) => normalizeHex(item) === normalizeHex(color),
    );
}

function TagForm({ tag, lang, onClose, onSave }: TagFormProps) {
    const copy = getTagsCopy(lang);

    const initialColor = normalizeHex(tag?.color ?? presetColors[0]);
    const initialCustomColor = isPresetColor(initialColor)
        ? defaultCustomColor
        : initialColor;

    const [name, setName] = useState(tag?.name ?? "");
    const [color, setColor] = useState(initialColor);
    const [customColor, setCustomColor] = useState(initialCustomColor);
    const [showCustomPicker, setShowCustomPicker] = useState(
        !isPresetColor(initialColor),
    );

    const previewName = name.trim() || "General";
    const customColorIsActive = normalizeHex(color) === normalizeHex(customColor);

    const handlePresetColor = (nextColor: string) => {
        setColor(nextColor);
        setShowCustomPicker(false);
    };

    const handleCustomColor = (nextColor: string) => {
        const cleanColor = normalizeHex(nextColor);

        setCustomColor(cleanColor);
        setColor(cleanColor);
        setShowCustomPicker(true);
    };

    return (
        <form
            className="space-y-5 p-5 sm:p-6"
            onSubmit={(event) => {
                event.preventDefault();

                const cleanName = name.trim();

                if (!cleanName) return;

                onSave({
                    id: tag?.id ?? createTagId(),
                    name: cleanName,
                    color: normalizeHex(color),
                    icon: tag?.icon ?? "Tag",
                });
            }}
        >
            <div className="rounded-2xl border border-sborder bg-slate-50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">
                    Preview
                </p>

                <div className="flex items-center gap-3 rounded-2xl border border-sborder bg-white p-3">
                    <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                        style={{ backgroundColor: color }}
                    >
                        <Tag size={18} />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-950">
                            {previewName}
                        </p>

                        <p className="text-xs text-muted">
                            0 {copy.activities}
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                    {copy.tagName}
                </label>

                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={lang === "es" ? "Ej: Universidad" : "Ex: University"}
                    className="w-full rounded-2xl border border-sborder bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-indigo-100"
                    required
                />
            </div>

            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                    <Palette size={15} />
                    {copy.color}
                </label>

                <div className="grid grid-cols-5 gap-2">
                    {presetColors.map((item) => {
                        const active =
                            normalizeHex(color) === normalizeHex(item) &&
                            !showCustomPicker;

                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => handlePresetColor(item)}
                                className={cn(
                                    "relative h-12 rounded-2xl border transition hover:scale-[1.03]",
                                    active
                                        ? "border-slate-900 ring-4 ring-slate-900/10"
                                        : "border-transparent",
                                )}
                                style={{ backgroundColor: item }}
                                aria-label={item}
                            >
                                {active && (
                                    <span className="absolute inset-0 flex items-center justify-center text-white">
                                        <Check size={18} strokeWidth={3} />
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        onClick={() => {
                            setColor(customColor);
                            setShowCustomPicker((current) => !current);
                        }}
                        className={cn(
                            "relative flex h-12 items-center justify-center rounded-2xl border transition hover:scale-[1.03]",
                            customColorIsActive && showCustomPicker
                                ? "border-slate-900 ring-4 ring-slate-900/10"
                                : "border-transparent",
                        )}
                        style={{ backgroundColor: customColor }}
                        aria-label="Custom color"
                    >
                        {customColorIsActive && showCustomPicker ? (
                            <Check size={18} strokeWidth={3} className="text-white" />
                        ) : (
                            <Palette size={18} className="text-white" />
                        )}
                    </button>
                </div>

                {showCustomPicker && (
                    <div className="mt-3 rounded-2xl border border-sborder bg-slate-50 p-3">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="text-xs font-bold uppercase tracking-wide text-muted">
                                {lang === "es"
                                    ? "Color personalizado"
                                    : "Custom color"}
                            </span>

                            <span className="rounded-full bg-white px-2.5 py-1 font-mono text-xs font-bold text-slate-700">
                                {customColor}
                            </span>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-sborder bg-white p-3">
                            <HexColorPicker
                                color={customColor}
                                onChange={handleCustomColor}
                                className="!w-full"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="w-full"
                >
                    {copy.cancel}
                </Button>

                <Button type="submit" className="w-full">
                    {copy.save}
                </Button>
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className="max-w-lg"
        >
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