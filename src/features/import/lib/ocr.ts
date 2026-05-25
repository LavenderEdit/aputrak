export type OcrProgress = {
    status: string;
    progress: number;
};

type ScheduleCrop = {
    label: string | null;
    sx: number;
    sy: number;
    sw: number;
    sh: number;
};

const DAY_LABELS = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function isWideScheduleImage(bitmap: ImageBitmap) {
    return bitmap.width / bitmap.height >= 1.8;
}

function getHeaderCrop(bitmap: ImageBitmap): ScheduleCrop | null {
    if (!isWideScheduleImage(bitmap)) return null;

    return {
        label: null,
        sx: Math.round(bitmap.width * 0.18),
        sy: 0,
        sw: Math.round(bitmap.width * 0.64),
        sh: Math.round(bitmap.height * 0.12),
    };
}

function getScheduleColumnCrops(bitmap: ImageBitmap): ScheduleCrop[] {
    if (!isWideScheduleImage(bitmap)) {
        return [
            {
                label: null,
                sx: 0,
                sy: 0,
                sw: bitmap.width,
                sh: bitmap.height,
            },
        ];
    }

    const leftGutter = Math.round(bitmap.width * 0.071);
    const rightEdge = Math.round(bitmap.width * 0.957);

    const topEdge = Math.round(bitmap.height * 0.12);
    const bottomEdge = Math.round(bitmap.height * 0.95);

    const usableWidth = rightEdge - leftGutter;
    const columnWidth = usableWidth / DAY_LABELS.length;
    const columnPadding = Math.round(clamp(bitmap.width * 0.009, 10, 24));

    return DAY_LABELS.map((label, index) => {
        const rawStart = Math.round(leftGutter + columnWidth * index);
        const rawEnd = Math.round(leftGutter + columnWidth * (index + 1));

        const sx = clamp(rawStart - columnPadding, 0, bitmap.width);
        const ex = clamp(rawEnd + columnPadding, 0, bitmap.width);

        return {
            label,
            sx,
            sy: topEdge,
            sw: ex - sx,
            sh: bottomEdge - topEdge,
        };
    });
}

async function preprocessBitmapCrop(
    bitmap: ImageBitmap,
    crop: ScheduleCrop,
): Promise<Blob> {
    const scale = Math.max(2, Math.min(4, 1700 / crop.sw));

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(crop.sw * scale);
    canvas.height = Math.round(crop.sh * scale);

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Could not prepare image for OCR.");
    }

    context.imageSmoothingEnabled = false;
    context.drawImage(
        bitmap,
        crop.sx,
        crop.sy,
        crop.sw,
        crop.sh,
        0,
        0,
        canvas.width,
        canvas.height,
    );

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];

        const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
        const contrasted = (gray - 128) * 1.9 + 128;
        const value = contrasted < 180 ? 0 : 255;

        data[index] = value;
        data[index + 1] = value;
        data[index + 2] = value;
        data[index + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Could not convert processed image."));
                return;
            }

            resolve(blob);
        }, "image/png");
    });
}

function cleanOcrText(text: string) {
    return text
        .replace(/\r/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n");
}

export async function recognizeImage(
    image: File,
    onProgress?: (progress: OcrProgress) => void,
): Promise<string> {
    const { createWorker, PSM } = await import("tesseract.js");

    const bitmap = await createImageBitmap(image);
    const headerCrop = getHeaderCrop(bitmap);
    const columnCrops = getScheduleColumnCrops(bitmap);

    const worker = await createWorker("spa", 1, {
        logger: (message) => {
            onProgress?.({
                status: message.status,
                progress: message.progress ?? 0,
            });
        },
    });

    try {
        await worker.setParameters({
            tessedit_pageseg_mode: PSM.SPARSE_TEXT,
            preserve_interword_spaces: "1",
            user_defined_dpi: "300",
        });

        const results: string[] = [];

        if (headerCrop) {
            onProgress?.({
                status: "Leyendo fecha del horario",
                progress: 0,
            });

            const processedHeader = await preprocessBitmapCrop(bitmap, headerCrop);
            const headerResult = await worker.recognize(processedHeader);
            const headerText = cleanOcrText(headerResult.data.text);

            if (headerText) {
                results.push(headerText);
            }
        }

        for (let index = 0; index < columnCrops.length; index++) {
            const crop = columnCrops[index];

            onProgress?.({
                status: crop.label ? `Leyendo ${crop.label}` : "Leyendo imagen",
                progress: index / columnCrops.length,
            });

            const processedImage = await preprocessBitmapCrop(bitmap, crop);
            const result = await worker.recognize(processedImage);
            const text = cleanOcrText(result.data.text);

            if (!text) continue;

            results.push(crop.label ? `${crop.label}\n${text}` : text);

            onProgress?.({
                status: crop.label
                    ? `${crop.label} procesado`
                    : "Imagen procesada",
                progress: (index + 1) / columnCrops.length,
            });
        }

        return results.join("\n\n");
    } finally {
        await worker.terminate();
        bitmap.close();
    }
}