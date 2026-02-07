import imageCompression from 'browser-image-compression';

interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
}

/**
 * 画像ファイルを圧縮して軽量化する
 * @param file 圧縮対象の File オブジェクト
 * @param options 圧縮オプション
 * @returns 圧縮された File オブジェクト
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    const defaultOptions = {
        maxSizeMB: 1,           // 最大 1MB
        maxWidthOrHeight: 1920, // 最大幅・高さ 1920px (フルHD)
        useWebWorker: true,    // Web Worker を使用してUIをブロックしないようにする
        initialQuality: 0.8,   // 初期品質 80%
        ...options
    };

    try {
        const compressedFile = await imageCompression(file, defaultOptions);

        // 元のファイル名と最終更新日時を維持して新しい File オブジェクトを返す
        return new File([compressedFile], file.name, {
            type: compressedFile.type,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error('Image compression failed:', error);
        // 失敗した場合はエラーにせず、元のファイルをそのまま返す（フォールバック）
        return file;
    }
}
