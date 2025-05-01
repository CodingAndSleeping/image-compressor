<template>
  <div class="image-compressor">
    <div class="github" @click="openGithub">github</div>
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

const openGithub = () => {
  window.open('https://github.com/CodingAndSleeping/image-compressor');
};
</script>
<style scoped lang="scss">
.image-compressor {
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .github {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
  }
  .github:hover {
    text-decoration: underline;
  }
}
</style>
