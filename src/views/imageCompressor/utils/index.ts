import type { TargetType } from '../types';
import UPNG from 'upng-js';
export async function compressImage(
  file: File,
  quality: number,
  targetType: TargetType,
): Promise<File> {
  return new Promise<File>(async (resolve, reject) => {
    if (targetType === 'png') {
      if (file.type !== 'image/png') return reject(new Error('请上传PNG图片'));

      const arrayBuffer = await file.arrayBuffer();
      const pngImage = UPNG.decode(arrayBuffer);

      const rgba = UPNG.toRGBA8(pngImage);
      const { width, height } = pngImage;

      // 调整色深（减少颜色数量）
      const compressedBuffer = UPNG.encode(
        rgba, // RGBA8 图像数据（数组形式）
        width,
        height,
        Math.round(256 * quality), // 压缩程度（0-256），值越小压缩率越高
      );
      const compressedBlob = new Blob([compressedBuffer], {
        type: 'image/png',
      });

      resolve(
        new File([compressedBlob], 'compressed.' + targetType, {
          type: 'image/png',
        }),
      );
    } else {
      const img = new Image();
      const imgUrl = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) return reject(new Error('Failed to get canvas context'));
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Failed to compress image'));
            const newFile = new File([blob], 'compressed.' + targetType, {
              type: `image/${targetType}`,
            });
            resolve(newFile.size < file.size ? newFile : file);
          },
          `image/${targetType}`,
          quality,
        );
      };

      img.src = imgUrl;
    }
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
