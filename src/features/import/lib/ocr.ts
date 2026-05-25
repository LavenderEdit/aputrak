export type OcrProgress = {
    status: string;
    progress: number;
};

async function preprocessImage(file: File): Promise<Blob> {
    const bitmap = await createImageBitmap(file);

    const scale = Math.max(2, Math.min(4, 2600 / bitmap.width));

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Could not prepare image for OCR.");
    }

    context.imageSmoothingEnabled = false;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let index = 0; index < data.length; index += 4) {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];

        const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
        const contrasted = (gray - 128) * 1.8 + 128;
        const value = contrasted < 175 ? 0 : 255;

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

export async function recognizeImage(
    image: File,
    onProgress?: (progress: OcrProgress) => void,
): Promise<string> {
    const { createWorker, PSM } = await import("tesseract.js");

    const processedImage = await preprocessImage(image);

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

        const result = await worker.recognize(processedImage);

        return result.data.text;
    } finally {
        await worker.terminate();
    }
}