<template>
  <div class="display-image">
    <div class="display-image__content">
      <div class="display-image__origin" v-if="originImage">
        <el-image
          class="display-image__origin-img"
          :preview-src-list="previewUrlList"
          :src="originImageUrl"
          fit="contain"
        />
        <span>原始图片: {{ formatBytes(originImage.size) }}</span>
      </div>
      <div class="display-image__compressed" v-if="compressedImage">
        <el-image
          class="display-image__compressed-img"
          :preview-src-list="previewUrlList"
          :src="compressedImageUrl"
          fit="contain"
        />
        <span>压缩后图片: {{ formatBytes(compressedImage.size) }}</span>
      </div>
    </div>
    <div class="display-image__actions" v-if="compressedImage">
      <el-button @click="handleDownload">下载压缩图片</el-button>
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
  a.download = compressedImage.value.name;
  a.click();
  a.remove();
};

const previewUrlList = computed(() => {
  return [originImageUrl.value, compressedImageUrl.value];
});
</script>
<style scoped lang="scss">
.display-image {
  width: 100%;
  margin: 0 20rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  .display-image__content {
    width: 60rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 2rem;

    .display-image__origin,
    .display-image__compressed {
      margin: 1rem;

      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        margin-top: 1rem;
      }
    }

    .display-image__origin-img,
    .display-image__compressed-img {
      height: 30rem;
      width: 30rem;
      border: 1px solid #ccc;
    }
  }
}
</style>
