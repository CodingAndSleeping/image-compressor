<template>
  <div class="display-image">
    <div class="display-image__content">
      <div class="display-image__origin" v-if="originImage">
        <img :src="originImageUrl" alt="原始图片" />
        <span>原始图片: {{ formatBytes(originImage.size) }}</span>
      </div>
      <div class="display-image__compressed" v-if="compressedImage">
        <img :src="compressedImageUrl" alt="压缩后图片" />
        <span>压缩后图片: {{ formatBytes(compressedImage.size) }}</span>
      </div>
    </div>
    <div class="display-image__actions" v-if="compressedImage">
      <el-button @click="handleDownload">下载图片</el-button>
      <el-button @click="handleCopy">复制图片</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { ImageState } from '../../types';
import { formatBytes } from '../../utils';
import { ElMessage } from 'element-plus';

const { originImage, compressedImage } = inject<ImageState>('image-state')!;

const originImageUrl = computed(() => {
  return URL.createObjectURL(originImage.value || new Blob([]));
});
const compressedImageUrl = computed(() => {
  return URL.createObjectURL(compressedImage.value || new Blob([]));
});

const handleDownload = () => {
  if (!compressedImage.value) return ElMessage.error('下载失败!');
  const a = document.createElement('a');
  a.href = compressedImageUrl.value;
  a.download = 'compressed.jpg';
  a.click();
};
const handleCopy = async () => {
  if (!compressedImage.value) return ElMessage.error('复制失败!');
  try {
    // await navigator.clipboard.write([
    //   new ClipboardItem({
    //     [compressedImage.value.type]: compressedImage.value,
    //   }),
    // ]);
    const renamedBlob = new Blob([await compressedImage.value.arrayBuffer()], {
      type: 'image/png', // 此处故意写为 PNG
    });
    console.log(formatBytes(renamedBlob.size));
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': renamedBlob }), // 以 PNG 名义写入
    ]);
    ElMessage.success('图片已复制到剪贴板!');
  } catch (err: unknown) {
    ElMessage.error('复制失败: ' + (err as Error).message);
  }
};
</script>
<style scoped lang="scss">
.display-image {
  width: 100%;
  margin: 0 20rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  .display-image__content {
    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: 2rem;

    .display-image__origin,
    .display-image__compressed {
      margin: 1rem;

      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        height: 20rem;
        object-fit: contain;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
