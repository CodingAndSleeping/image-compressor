import type { Ref } from 'vue';

export type TargetType = 'jpeg' | 'png' | 'webp';

export type ImageState = {
  originImage: Ref<File | null>;
  compressedImage: Ref<File | null>;
  changeOriginImage: (file: File) => void;
  changeCompressedImage: (file: File) => void;
};
