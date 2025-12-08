<template>
  <el-space class="space-grid-container" direction="vertical" :size="20" fill>
    <!-- 调试信息 -->
    <div v-if="spaces.length > 0" style="display: none;">
      调试: 接收到 {{ spaces.length }} 个空间，第一个空间: {{ spaces[0] }}
    </div>
    <!-- 网格布局 -->
    <el-row class="space-grid" :gutter="20">
      <el-col
        v-for="space in spaces"
        :key="space.id"
        :xs="12" :sm="8" :md="6" :lg="6" :xl="6"
      >
        <SpaceCard
          :space-data="space"
          @click="() => handleSpaceClick(space)"
        />
      </el-col>
    </el-row>

    <!-- 无空间 -->
    <el-empty
        v-if="spaces.length === 0 && !loading"
        description="暂无空间"
        :image-size="200"
    />

    <!-- 加载状态 -->
    <el-skeleton
      v-if="loading"
      :rows="4"
      animated
      class="loading-skeleton"
    >
    <template #template>
      <el-row :gutter="20">
        <el-col
          v-for="n in 16"
          :key="n"
          :xs="12" :sm="8" :md="6" :lg="6" :xl="6"
        >
          <el-skeleton-item variant="rect" class="skeleton-card" />
        </el-col>
      </el-row>
    </template>
  </el-skeleton>
</el-space>
</template>

<script setup lang="ts">
import { ElEmpty, ElSkeleton, ElSkeletonItem, ElRow, ElCol, ElSpace } from 'element-plus'
import SpaceCard from './SpaceCard.vue'
import type { SpaceInfo } from '@/types/space'

interface Props  {
  spaces: SpaceInfo[]
  loading?: boolean
}

const { spaces, loading = false } = defineProps<Props>()

// 使用 defineEmits 定义 emits
interface Emits {
  (e: 'spaceClick', space: SpaceInfo): void
}

const emit = defineEmits<Emits>()

const handleSpaceClick = (space: SpaceInfo) => {
  emit('spaceClick', space)
}

</script>

<style scoped>
.space-grid-container {
  width: 100%;
}

.space-grid {
  margin-bottom: 20px;
}

.loading-skeleton {
  width: 100%;
}

.skeleton-card {
  width: 100%;
  height: 140px;
  border-radius: 20px;
}

:deep(.el-col) {
  margin-bottom: 20px;
}
</style>
