<template>
  <div class="home-page-container">
    <el-header class="fixed-header">
      <div class="header-content">
        <div class="header-left">
          <div>
            <h2>物品管理系统</h2>
          </div>
          <div class="english-title">
            <div>GOODS</div>
            <div>Management</div>
          </div>
        </div>
        <div class="header-right">
          <div class="user-info">
            <span>{{ greeting }}，{{ account }}</span>
            <el-avatar
              :size="36"
              :src="avatarUrl"
              @error="handleAvatarError"
            >
              <span style="font-size: 14px;">{{ account.charAt(0) }}</span>
            </el-avatar>
          </div>
          <el-button type="primary" link @click="handleLogout" style="color: white; margin-left: 20px;">
            退出登录
          </el-button>
        </div>
      </div>
    </el-header>

    <div class="main-content-container">
      <el-aside class="fixed-sidebar">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
          background-color="#f5f7fa"
        >
          <el-menu-item index="place">
            <el-icon><Location /></el-icon>
            <span>场所</span>
          </el-menu-item>
          <el-menu-item index="files">
            <el-icon><Folder /></el-icon>
            <span>文件库</span>
          </el-menu-item>
          <el-menu-item index="management">
            <el-icon><Setting /></el-icon>
            <span>参与管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <div class="scrollable-content">
        <div class="fixed-search">
          <el-card shadow="never" style="margin-bottom: 20px;">
            <div style="display: flex; gap: 10px; align-items: center;">
              <el-input
                v-model="searchKeyWord"
                placeholder="请输入搜索内容"
                style="width: 300px;"
                @keyup.enter="handleSearch"
              >
                <template #append>
                  <el-button @click="handleSearch" type="primary">
                    <el-icon><Search /></el-icon>
                    搜索
                  </el-button>
                </template>
              </el-input>

              <el-button v-if="isSearchMode" @click="handleCancelSearch" type="info" link>
                取消搜索
              </el-button>
            </div>
          </el-card>
        </div>

        <div class="main-scroll-area">
          <el-card>
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>{{ currentViewTitle }}</span>
                <div>
                  <el-button type="primary" link @click="handleRefresh">
                    <el-icon><Refresh /></el-icon>
                    刷新
                  </el-button>
                </div>
              </div>
            </template>

            <div v-if="isSearchMode" class="search-navigation">
              <el-card shadow="never" style="margin-bottom: 20px;">
                <el-tabs v-model="searchActiveTab" @tab-change="handleSearchTabChange">
                  <el-tab-pane label="物品" name="items"></el-tab-pane>
                  <el-tab-pane label="文件" name="files" disabled>
                    <template #label>
                      <span style="color: #c0c4cc;">文件</span>
                    </template>
                  </el-tab-pane>
                </el-tabs>
              </el-card>
            </div>

            <div v-if="activeMenu === 'place' && !isSearchMode">

              <el-card shadow="never" style="margin-bottom: 20px;">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item>
                    <a
                      @click.prevent="spaceNav.handleBreadcrumbClick(-1)"
                      style="cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 4px;"

                      :style="{ color: spaceNav.breadcrumbs.value.length === 0 ? '#303133' : '#606266' }"
                    >
                      <el-icon><House /></el-icon>
                      <span>我的场所</span>
                    </a>
                  </el-breadcrumb-item>

                  <el-breadcrumb-item
                    v-for="(crumb, index) in spaceNav.breadcrumbs.value"
                    :key="crumb.id"
                  >
                    <span v-if="index === spaceNav.breadcrumbs.value.length - 1" style="font-weight: bold; color: #303133;">
                      {{ crumb.name }}
                    </span>
                    <a v-else @click.prevent="spaceNav.handleBreadcrumbClick(index)" style="cursor: pointer; color: #606266;">
                      {{ crumb.name }}
                    </a>
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </el-card>

              <SpaceGrid
               :spaces="spaceNav.currentSpaces.value"
               :loading="spaceNav.loading.value"
               @space-click="spaceNav.handleSpaceClick"
             />

             <div class="pagination-container" v-if="spaceNav.total.value > 0">
               <el-pagination

                 v-model:current-page="spaceNav.pagination.value.page"
                 v-model:page-size="spaceNav.pagination.value.pageSize"

                 :page-sizes="[16, 32, 48, 64]"

                 :total="spaceNav.total.value"

                 layout="total, sizes, prev, pager, next, jumper"
                 @size-change="spaceNav.handleSizeChange"
                 @current-change="spaceNav.handleCurrentChange"
               />
             </div>
            </div>

            <div v-else-if="isSearchMode">
               <el-card shadow="never" style="margin-bottom: 20px;">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item>
                    <el-icon><Search /></el-icon>
                    <span>共找到{{ searchTotal }}个结果</span>
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </el-card>

              <div v-if="searchActiveTab === 'items'">
                <SpaceGrid
                  :spaces="searchResults"
                  :loading="searchLoading"
                  @space-click="handleSearchItemClick"
                />
                <div class="pagination-container" v-if="searchTotal > 0">
                  <el-pagination
                    v-model:current-page="searchPagination.page"
                    v-model:page-size="searchPagination.pageSize"
                    :page-sizes="[16, 32, 48, 64]"
                    :total="searchTotal"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSearchSizeChange"
                    @current-change="handleSearchCurrentChange"
                  />
                </div>
                <el-empty
                  v-if="searchTotal === 0 && !searchLoading"
                  description="暂无搜索结果"
                  :image-size="200"
                />
              </div>
            </div>

            <div v-else-if="activeMenu === 'files' && !isSearchMode">
              <el-empty description="文件库功能开发中..." />
            </div>

            <div v-else-if="activeMenu === 'management' && !isSearchMode">
              <el-empty description="参与管理功能开发中..." />
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Folder, Location, Setting, Search, Refresh, House } from '@element-plus/icons-vue'
import { getUserInfo } from '@/network/apis/user'
import type { SpaceInfo } from '@/types/space'
import type { PageParams } from '@/types/api'
import SpaceGrid from '@/components/SpaceGrid.vue'
import moment from 'moment'
import { searchItems } from '@/network/apis/space'

// 核心改动 1: 引入并使用组合式函数
import { useSpaceItems } from '@/composables/useSpaceItems'

// 初始化组合式函数 (所有场所导航、数据、分页逻辑都在这里)
const spaceNav = useSpaceItems()

const router = useRouter()
const account = ref('')
const avatarUrl = ref('')
const activeMenu = ref('place')
const searchKeyWord = ref('')
const isSearchMode = ref(false)
const searchActiveTab = ref('items')
const searchResults = ref<SpaceInfo[]>([])
const searchLoading = ref(false)
const searchTotal = ref(0)
const searchPagination = ref({
  page: 1,
  pageSize: 16
})

// 问候语逻辑
const greeting = computed(() => {
  const hour = moment().hour()
  if (hour > 5 && hour < 9) return '早上好'
  else if (hour >= 9 && hour < 12) return '上午好'
  else if (hour >= 12 && hour < 14) return '中午好'
  else if (hour >= 14 && hour < 18) return '下午好'
  else if (hour >= 18 && hour < 22) return '晚上好'
  else return '夜深了'
})

const currentViewTitle = computed(() => {
  if (isSearchMode.value) {
    return `搜索: ${searchKeyWord.value}`
  }
  switch (activeMenu.value) {
    case 'place': return '场所'
    case 'files': return '文件库'
    case 'management': return '参与管理'
    default: return ''
  }
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await getUserInfo()
    if (response.code === 200 && response.data) {
      account.value = response.data.name || response.data.phone || '用户'
      avatarUrl.value = response.data.avatar || ''
      localStorage.setItem('userName', account.value)
      localStorage.setItem('account', response.data.phone || '')
    } else {
      ElMessage.error('获取用户信息失败')
      account.value = localStorage.getItem('userName') || '用户'
      avatarUrl.value = localStorage.getItem('avatar') || 'https://via.placeholder.com/50'
    }
  } catch (error) {
    console.error('获取用户信息错误:', error)
  }
}

onMounted(() => {
  account.value = localStorage.getItem('account') || '用户'
  fetchUserInfo()
  // 首次加载调用 Composable 的方法
  if (activeMenu.value === 'place') {
    spaceNav.fetchSpaces()
  }
})

// 菜单选择处理
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
  if (index !== 'place' && isSearchMode.value) {
    handleCancelSearch()
  }
}

// 搜索相关逻辑 (保持不变)
const handleSearch = async () => {
  if (!searchKeyWord.value.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  isSearchMode.value = true
  searchPagination.value.page = 1
  await performSearch()
}

const performSearch = async () => {
  if (!searchKeyWord.value.trim()) return
  searchLoading.value = true
  try {
    const response = await searchItems({
      offset: searchPagination.value.page,
      limit: searchPagination.value.pageSize
    }, {
      name: searchKeyWord.value,
      type: -1,
      highPrice: -1,
      lowPrice: -1,
      dateType: -1,
      deleted: 0,
      hide: 0,
      labelld: []
    })

    if (response.code === 200 && response.data) {
      searchResults.value = response.data.records.map(item => ({
        id: item.id,
        privacy: item.privacy === 'PRIVACY' ? 1 : 0,
        type: item.type,
        name: item.name,
        cover: item.cover,
        address: null,
        date: null,
        itemCover: item.cover ? [item.cover] : null,
        userId: item.userId,
        userName: ''
      }))
      searchTotal.value = response.data.total || 0
    } else {
      ElMessage.error(response.msg || '搜索失败')
      searchResults.value = []
      searchTotal.value = 0
    }
  } catch (error: any) {
    console.error('搜索错误:', error)
    ElMessage.error('搜索失败: ' + (error.message || '未知错误'))
  } finally {
    searchLoading.value = false
  }
}

const handleCancelSearch = () => {
  isSearchMode.value = false
  searchKeyWord.value = ''
  searchResults.value = []
  searchTotal.value = 0
  // 退出搜索时，重新加载当前层级的数据
  if (activeMenu.value === 'place') {
    spaceNav.fetchSpaces()
  }
}

const handleSearchTabChange = (tab: string) => {
  searchActiveTab.value = tab
  if (tab === 'items') {
    performSearch()
  } else if (tab === 'files') {
    searchResults.value = []
    searchTotal.value = 0
    ElMessage.info('文件搜索功能开发中...')
  }
}

const handleSearchSizeChange = (newSize: number) => {
  searchPagination.value.pageSize = newSize
  searchPagination.value.page = 1
  performSearch()
}

const handleSearchCurrentChange = (newPage: number) => {
  searchPagination.value.page = newPage
  performSearch()
}

const handleSearchItemClick = (item: SpaceInfo) => {
  ElMessage.info(`点击搜索项: ${item.name}`)
}

// 刷新逻辑调用 Composable
const handleRefresh = () => {
  if (isSearchMode.value) {
    performSearch()
    ElMessage.success('搜索结果已刷新')
  } else if (activeMenu.value === 'place') {
    // 重置分页到第一页并重新获取数据
    spaceNav.pagination.value.page = 1
    spaceNav.fetchSpaces()
    ElMessage.success('空间数据已刷新')
  } else {
    ElMessage.success('刷新成功')
  }
}

const handleAvatarError = () => {
  avatarUrl.value = 'https://via.placeholder.com/50'
}

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('account')
  localStorage.removeItem('userName')
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userId')
  ElMessage.success('已退出登录')
  router.push('/webLogin')
}

// 监听菜单变化，自动获取场所数据
watch(
  () => activeMenu.value,
  (newMenu) => {
    if (newMenu === 'place' && !isSearchMode.value) {
      spaceNav.fetchSpaces()
    }
  }
)
</script>

<style scoped>
.home-page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #409EFF;
  color: white;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.main-content-container {
  display: flex;
  margin-top: 60px;
  height: calc(100vh - 60px);
}

.fixed-sidebar {
  width: 200px;
  background-color: #f5f7fa;
  border-right: 1px solid #e4e7ed;
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  z-index: 999;
  overflow-y: auto;
}

.scrollable-content {
  flex: 1;
  margin-left: 200px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.fixed-search {
  position: sticky;
  top: 0;
  z-index: 998;
  background: white;
  padding: 20px 20px 0 20px;
}

.main-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px 20px;
}

.search-navigation {
  margin-bottom: 20px;
}

.english-title {
  display: flex;
  flex-direction: column;
  line-height: 1;
  font-size: 22px;
  font-weight: bold;
  color: white;
  text-align: left;
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
}

.english-title div:first-child {
  margin-bottom: 2px;
}

.el-menu-vertical-demo {
  border-right: none;
}

.el-menu-item {
  margin: 4px 8px;
  border-radius: 4px;
}

.el-menu-item.is-active {
  background-color: #409EFF !important;
  color: white;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
