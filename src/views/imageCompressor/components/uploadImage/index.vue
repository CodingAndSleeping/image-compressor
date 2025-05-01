<template>
  <div class="upload-image">
    <div class="upload-image__container">
      <el-tabs>
        <el-tab-pane label="本地图片">
          <div
            class="upload-image__container--local"
            @dragover.prevent
            @drop.prevent="handleDrop"
            @paste="handlePaste"
            tabindex="0"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              hidden
            />
            <el-button type="primary" size="large" @click="fileInput?.click()"
              >点击上传</el-button
            >
            <span>拖拽或者粘贴到空白区域上传</span>
          </div></el-tab-pane
        >
        <el-tab-pane label="在线图片"
          ><div class="upload-image__container--url">
            <el-input
              class="url-input"
              v-model="imgUrl"
              :rows="2"
              type="textarea"
              placeholder="请输入图片在线地址"
            />

            <el-button type="primary" size="large" @click="handleCompress">
              压缩
            </el-button>
          </div></el-tab-pane
        >
      </el-tabs>
    </div>

    <div class="upload-image__option">
      <div class="upload-image__option__item">
        <span>压缩质量:</span>
        <el-slider
          class="quality-slider"
          v-model="quality"
          :min="0"
          :max="1"
          :step="0.1"
        ></el-slider>
      </div>

      <div class="upload-image__option__item">
        <span>目标格式:</span>
        <el-select
          class="target-type-select"
          v-model="targetType"
          placeholder="请选择目标格式"
        >
          <el-option label="JPEG" value="jpeg"></el-option>
          <el-option label="PNG" value="png"></el-option>
          <el-option label="WebP" value="webp"></el-option>
        </el-select>

        <div class="tooltip">
          <el-tooltip
            class="box-item"
            effect="dark"
            content="若选择目标格式为PNG，则原图片格式也必须为PNG"
            placement="top-start"
          >
            <el-icon><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, useTemplateRef } from 'vue';
import type { ImageState, TargetType } from '../../types';
import { compressImage } from '../../utils';
import { ElMessage } from 'element-plus';

const { changeOriginImage, changeCompressedImage } =
  inject<ImageState>('image-state')!;

const quality = ref(0.7);
const targetType = ref<TargetType>('jpeg');

const imgUrl = ref(''); // 图片在线地址

const fileInput = useTemplateRef<HTMLInputElement | null>('fileInput');

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    await updateFile(file);
    input.value = '';
  }
};

const handlePaste = async (event: ClipboardEvent) => {
  if (!event.clipboardData) return;

  const item = [...event.clipboardData.items].find((i) =>
    i.type.startsWith('image'),
  );

  if (!item) return;
  const file = item.getAsFile();
  if (!file) return;
  changeOriginImage(file);
  await updateFile(file);
};

const handleDrop = async (event: DragEvent) => {
  if (!event.dataTransfer) return;
  const file = event.dataTransfer.files[0];
  if (!file) return;
  await updateFile(file);
};

const handleCompress = async () => {
  if (!imgUrl.value) return ElMessage.error('请输入图片在线地址!');
  fetch(imgUrl.value)
    .then((res) => res.blob())
    .then(async (blob) => {
      const file = new File([blob], 'remote-image', { type: blob.type });
      await updateFile(file);
    })
    .catch((err) => {
      ElMessage.error('加载图片失败: ' + err.message);
    });
};

// 提取压缩图片和修改状态的代码
const updateFile = async (file: File) => {
  const newFile = await compressImage(
    file,
    quality.value,
    targetType.value,
  ).catch((err) => {
    ElMessage.error((err as Error).message);
  });
  newFile && changeOriginImage(file);
  newFile && changeCompressedImage(newFile);
};
</script>
<style scoped lang="scss">
.upload-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40rem;

  .upload-image__container {
    width: 100%;
    margin-bottom: 1rem;

    .upload-image__container--local {
      height: 10rem;
      border: 2px dashed #ccc;

      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      span {
        color: #ccc;
      }
    }

    .upload-image__container--url {
      display: flex;
      align-items: center;
      .url-input {
        margin-right: 1rem;
      }
    }
  }
  .upload-image__option {
    display: flex;
    align-items: center;
    justify-content: center;
    .upload-image__option__item {
      display: flex;
      align-items: center;
      margin-top: 1rem;
      margin-right: 1rem;
      span {
        width: fit-content;
        margin-right: 1rem;
      }
      .quality-slider {
        width: 10rem;
      }
      .target-type-select {
        width: 10rem;
      }
    }

    .tooltip {
      margin-left: 1rem;
    }
  }
}
</style>
