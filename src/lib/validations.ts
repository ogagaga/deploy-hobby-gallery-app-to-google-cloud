import { z } from "zod";

// --- 定数 ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// --- ファイルバリデーションスキーマ ---
export const imageFileSchema = z
    .any()
    .refine((file) => file instanceof File && file.size > 0, "画像を選択してください。")
    .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, `ファイルサイズは5MB以下にしてください。`)
    .refine(
        (file) => file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type),
        ".jpg, .jpeg, .png, .webp 形式の画像のみアップロード可能です。"
    );

// 更新時のメイン画像（任意）
export const optionalImageFileSchema = z
    .any()
    .refine(
        (file) => {
            if (!file || !(file instanceof File) || file.size === 0) return true;
            return file.size <= MAX_FILE_SIZE;
        },
        `ファイルサイズは5MB以下にしてください。`
    )
    .refine(
        (file) => {
            if (!file || !(file instanceof File) || file.size === 0) return true;
            return ACCEPTED_IMAGE_TYPES.includes(file.type);
        },
        ".jpg, .jpeg, .png, .webp 形式の画像のみアップロード可能です。"
    );

// --- 作品バリデーションスキーマ ---
export const workSchema = z.object({
    title: z
        .string()
        .min(1, "タイトルを入力してください。")
        .max(100, "タイトルは100文字以内で入力してください。"),
    kitName: z
        .string()
        .max(100, "キット名は100文字以内で入力してください。")
        .optional()
        .or(z.literal("")),
    maker: z
        .string()
        .max(100, "メーカー名は100文字以内で入力してください。")
        .optional()
        .or(z.literal("")),
    scale: z
        .string()
        .max(50, "スケールは50文字以内で入力してください。")
        .optional()
        .or(z.literal("")),
    genre: z
        .string()
        .max(50, "ジャンルは50文字以内で入力してください。")
        .optional()
        .or(z.literal("")),
    paints: z
        .string()
        .max(1000, "使用塗料は1000文字以内で入力してください。")
        .optional()
        .or(z.literal("")),
    description: z
        .string()
        .max(5000, "説明文は5000文字以内で入力してください。")
        .optional()
        .or(z.literal("")),
    tags: z
        .string()
        .optional()
        .or(z.literal("")),
    projectId: z
        .string()
        .optional()
        .or(z.literal("")),
});

// 新規作成用（必須フィールド込み）
export const createWorkSchema = workSchema.extend({
    mainImage: imageFileSchema,
    subImages: z.array(z.any()).optional(),
});

// 更新用（一部オプショナル）
export const updateWorkSchema = workSchema.extend({
    mainImage: optionalImageFileSchema.optional(),
    deleteImageUrls: z.array(z.string()).optional(),
    imageOrder: z.string().optional(), // JSON文字列として送られてくるため
});
// --- シリーズバリデーションスキーマ ---
export const projectSchema = z.object({
    name: z
        .string()
        .min(1, "シリーズ名を入力してください。")
        .max(100, "シリーズ名は100文字以内で入力してください。"),
    description: z
        .string()
        .max(2000, "説明文は2000文字以内で入力してください。")
        .optional()
        .or(z.literal("")),
});

export const createProjectSchema = projectSchema.extend({
    mainImage: optionalImageFileSchema.optional(), // シリーズは画像無しでも可
});

export const updateProjectSchema = projectSchema.extend({
    mainImage: optionalImageFileSchema.optional(),
});
