<template>
  <div class="create-workspace">
    <div class="breadcrumb">
      <router-link to="/">
        Workspaces
      </router-link>
    </div>

    <h1>Create Workspace</h1>

    <div class="form-container">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="form-input"
        >
        <div class="input-help">
          Workspace name cannot be changed after creation
        </div>
      </div>

      <div class="form-group">
        <label>Workspace Avatar</label>
        <div class="avatar-options">
          <div
            v-for="color in avatarColors"
            :key="color"
            class="avatar-color"
            :class="{ active: selectedColor === color }"
            :style="{ backgroundColor: color }"
            @click="selectedColor = color"
          />
        </div>
        <div class="upload-section">
          <div class="upload-label">
            Or use an image instead... (Max 1MB)
          </div>
          <div class="upload-area">
            <span v-if="!selectedImage">No File Chosen</span>
            <span v-else>{{ selectedImage.name }}</span>
            <button
              class="upload-btn"
              @click="triggerFileInput"
            >
              Upload Image
            </button>
          </div>
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleFileUpload"
          >
        </div>
      </div>

      <div class="form-actions">
        <button
          class="btn-cancel"
          @click="$router.push('/')"
        >
          Cancel
        </button>
        <button
          class="btn-create"
          @click="createWorkspace"
        >
          Create New Workspace
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { workspaceService } from '@/services/workspacesService'

const router = useRouter()
const name = ref('')
const selectedColor = ref('#4285f4')
const selectedImage = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const avatarColors = [
  '#4285f4', // 파란색
  '#8c8c8c', // 회색
  '#9c27b0', // 보라색
  '#e57373', // 연한 빨간색
  '#66bb6a', // 연한 초록색
  '#2c3e50', // 네이비
  '#f5a623', // 주황색
  '#26a69a', // 청록색
  '#3f51b5', // 남색
]

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.size <= 1024 * 1024) { // 1MB
      selectedImage.value = file
    } else {
      alert('File size should not exceed 1MB')
      input.value = ''
    }
  }
}

const createWorkspace = async () => {
  if (!name.value.trim()) {
    alert('워크스페이스 이름을 입력해주세요.')
    return
  }

  try {
    const workspaceData = {
      name: name.value,
      config: {
        color: selectedColor.value,
        avatar: selectedImage.value
          ? await convertImageToBase64(selectedImage.value)
          : null,
      },
    }
    await workspaceService.createWorkspace(workspaceData)

    // 성공 시 Overview 페이지로 이동
    router.push('/')
  } catch (error) {
    console.error('워크스페이스 생성 실패:', error)
    alert('워크스페이스 생성 중 오류가 발생했습니다.')
  }
}

// 이미지를 Base64로 변환하는 헬퍼 함수
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}
</script>

<style scoped lang="scss">
.create-workspace {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 16px;

  a {
    color: #1677ff;
    text-decoration: none;
    font-size: 14px;

    &:hover {
      text-decoration: underline;
    }
  }
}

h1 {
  font-size: 24px;
  font-weight: 500;
  color: #1a1f36;
  margin: 0 0 32px 0;
}

.form-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #1a1f36;
    margin-bottom: 8px;
  }
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    border-color: #1677ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
  }
}

.input-help {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.avatar-options {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.avatar-color {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  position: relative;

  &:hover {
    transform: scale(1.1);
  }

  &.active {
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 16px;
    }
  }
}

.upload-section {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 16px;
}

.upload-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.upload-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #6b7280;
  font-size: 14px;
}

.upload-btn {
  background: white;
  border: 1px solid #d9d9d9;
  padding: 4px 12px;
  border-radius: 6px;
  color: #1a1f36;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    border-color: #1677ff;
    color: #1677ff;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  color: #1a1f36;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    border-color: #1677ff;
    color: #1677ff;
  }
}

.btn-create {
  padding: 8px 16px;
  background: #1677ff;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #0958d9;
  }

  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
  }
}

.hidden {
  display: none;
}
</style>
