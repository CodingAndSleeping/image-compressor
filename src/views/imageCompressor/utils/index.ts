import type { TargetType } from '../types';

export function compressImage(
  file: File,
  quality: number,
  targetType: TargetType,
): Promise<File> {
  const img = new Image();
  const imgUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
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
          const newFile = new File([blob], 'compressed-' + file.name, {
            type: `image/${targetType}`,
          });
          resolve(newFile.size < file.size ? newFile : file);
        },
        `image/${targetType}`,
        quality,
      );
    };

    img.src = imgUrl;
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
