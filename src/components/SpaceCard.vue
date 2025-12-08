<template>
  <el-card class="space-card" shadow="hover" @click="handleSpaceClick">
    <div class="card-content">
      <!-- 空间封面 -->
       <el-avatar
        class="space-cover"
        :size="80"
        :src="spaceData.cover"
        :alt="spaceData.name"
        @error="handleImageError"
       >
        <span class="cover-placeholder">{{ spaceData.name.charAt(0) }}</span>
       </el-avatar>
       <!-- 空间信息 -->
        <div class="space-info">
          <div class="space-header">
            <el-text class="space-name" truncated>{{ spaceData.name }}</el-text>
            <el-tag
              v-if="spaceData.privacy === 1"
              size="small"
              type="info"
            >
            隐私
            </el-tag>
             <el-tag
              v-else
              size="small"
              type="success"
            >
            公开
            </el-tag>
          </div>
          <el-space class="space-details" direction="vertical" :size="4">
            <el-text class="space-type" size="small">
              <el-icon><Folder /></el-icon>
              {{ getTypeText(spaceData.type) }}
            </el-text>
            <el-text
            class="space-address"
            v-if="spaceData.address"
            size="small"
            truncated
            >
              <el-icon><Location /></el-icon>
              {{ spaceData.address }}
            </el-text>
          </el-space>

          <!-- 内部物品封面预览 -->
          <el-space
            class="item-covers-preview"
            v-if="spaceData.itemCover && spaceData.itemCover.length > 0"
          >
            <el-avatar
             class="item-cover"
             v-for="(cover, index) in spaceData.itemCover.slice(0, 5)"
            :key="index"
            :size="24"
            :src="cover"
            :alt="`物品封面${index + 1}`"
            @error="() => handleItemCoverError(index)"
            >
              <span v-if="index === 4 && spaceData.itemCover.length > 5" class="more-count">
                +{{ spaceData.itemCover.length - 5 }}
              </span>
              <el-icon v-else><Picture /></el-icon>
            </el-avatar>
          </el-space>
          <el-text v-else class="no-items" type="info" size="small">
            暂无物品
          </el-text>
        </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Folder, Location, Picture } from '@element-plus/icons-vue'
import type { SpaceInfo } from '@/types/space'

interface Props {
  spaceData: SpaceInfo
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: (space: SpaceInfo) => void
}>()

const handleSpaceClick = () => {
  emit('click', props.spaceData)
}

const handleImageError = () => {
  // 头像加载失败处理
}

const handleItemCoverError = (index: number) => {
  // 物品封面加载失败处理
  console.log(`物品封面加载失败，索引为${index}`)
}

const getTypeText = (type: number) => {
  switch (type) {
    case 0: return '房屋'
    case 1: return '空间'
    case 2: return '物品'
    case 3: return '暂存区'
    default: return '未知'
  }
}
</script>

<style scoped>
.space-card {
  cursor: pointer;
  border-radius: 20px;
  height: 140px;
}

.space-card :deep(.el-card__body) {
  padding: 16px;
  height: 100%;
}

.card-content {
  display: flex;
  height: 100%;
}

.space-cover {
  margin-right: 16px;
  flex-shrink: 0;
  border-radius: 16px;
}

.cover-placeholder {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.space-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.space-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.space-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  margin-right: 8px;
}

.space-details {
  margin-bottom: 8px;
}

.space-type,
.space-address {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-covers-preview {
  flex: 1;
  align-items: center;
}

.item-cover {
  border-radius: 6px;
}

.more-count {
  font-size: 10px;
  font-weight: bold;
  color: white;
}

.no-items {
  flex: 1;
  display: flex;
  align-items: center;
  font-style: italic;
}
</style>
