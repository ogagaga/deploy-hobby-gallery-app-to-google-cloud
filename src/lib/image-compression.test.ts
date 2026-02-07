import { describe, it, expect, vi } from 'vitest';
import { compressImage } from './image-compression';
import imageCompression from 'browser-image-compression';

// browser-image-compression をモック
vi.mock('browser-image-compression', () => ({
    default: vi.fn().mockImplementation((file) => Promise.resolve(file)),
}));

describe('compressImage', () => {
    it('ファイルを圧縮して新しい File オブジェクトを返すこと', async () => {
        const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
        const result = await compressImage(mockFile);

        expect(imageCompression).toHaveBeenCalledWith(mockFile, expect.any(Object));
        expect(result).toBeInstanceOf(File);
        expect(result.name).toBe('test.jpg');
        expect(result.type).toBe('image/jpeg');
    });

    it('圧縮に失敗した場合は元のファイルを返すこと', async () => {
        vi.mocked(imageCompression).mockRejectedValueOnce(new Error('Compression error'));

        const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
        const result = await compressImage(mockFile);

        expect(result).toBe(mockFile);
    });
});
