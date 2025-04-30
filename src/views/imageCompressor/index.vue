<template>
  <div class="image-compressor">
    <UploadImage />
    <DisplayImage />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import UploadImage from './components/uploadImage/index.vue';
import DisplayImage from './components/displayImage/index.vue';
import type { ImageState } from './types';

const originImage = ref<File | null>(null);
const compressedImage = ref<File | null>(null);

const changeOriginImage = (file: File) => {
  originImage.value = file;
};

const changeCompressedImage = (file: File) => {
  compressedImage.value = file;
};

provide<ImageState>('image-state', {
  originImage,
  compressedImage,
  changeOriginImage,
  changeCompressedImage,
});
</script>
<style scoped lang="scss">
.image-compressor {
  padding-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
