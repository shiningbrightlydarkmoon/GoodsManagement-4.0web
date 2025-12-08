// src/composables/useSpaceItems.ts

import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { Ref, ComputedRef } from 'vue' // 引入必要的 Ref/ComputedRef 类型
import type { PathNode, SpaceInfo } from '@/types/space'
import type { PageParams } from '@/types/api'
import { getSpaceList, getSpaceItems } from '@/network/apis/space'

// ==========================================
// 组合式函数返回值的 TypeScript 接口 (契约)
// ==========================================
export interface SpaceItemsComposable {
    pagination: Ref<PageParams>;
    total: Ref<number>;
    loading: Ref<boolean>;
    currentSpaces: Ref<SpaceInfo[]>;
    breadcrumbs: Ref<PathNode[]>;
    currentId: ComputedRef<number | null>;
    fatherId: ComputedRef<number | null>;
    fetchSpaces: () => Promise<void>;
    handleSpaceClick: (space: SpaceInfo) => void;
    handleBreadcrumbClick: (index: number) => void;
    handleSizeChange: (newSize: number) => void;
    handleCurrentChange: (newPage: number) => void;
}

// ==========================================
// 组合式函数实现
// ==========================================
export function useSpaceItems(): SpaceItemsComposable {
    // 状态定义
    const pagination = ref<PageParams>({ page: 1, pageSize: 16 })
    const total = ref(0)
    const loading = ref(false)
    const currentSpaces = ref<SpaceInfo[]>([])
    const breadcrumbs = ref<PathNode[]>([])

    // 计算属性: currentId (当前层级 ID)
    const currentId = computed(() => {
        if (breadcrumbs.value.length > 0) {
        // 使用 length - 1 访问数组末尾元素
        return breadcrumbs.value[breadcrumbs.value.length - 1]!.id
    }
    return null // null 代表根目录
    })

    // 计算属性: fatherId (上一层 ID)
    const fatherId = computed(() => {
        if (breadcrumbs.value.length >= 2) {
          // 使用非空断言 !
          return breadcrumbs.value[breadcrumbs.value.length - 2]!.id
        }
        return null
    })

    // 核心逻辑: 获取空间/物品列表
    const fetchSpaces = async () => {
        loading.value = true
        try {
            let response
            const params = pagination.value

            // 关键判断：根据 currentId 决定调用根目录接口还是子目录接口
            if (currentId.value) {
                // 子目录数据: 调用 GET /items/{itemId}/items
                response = await getSpaceItems(currentId.value, params)
            } else {
                // 根目录数据: 调用 GET /items/rooms
                response = await getSpaceList(params)
            }

            if (response.code === 200 && response.data) {
                currentSpaces.value = response.data.records || []
                total.value = response.data.total || 0
            } else {
                ElMessage.error(response.msg || '获取列表失败')
                currentSpaces.value = []
                total.value = 0
            }
        } catch (error: any) {
            console.error('获取列表异常:', error)
            ElMessage.error('获取列表失败: ' + (error.message || '未知错误'))
            currentSpaces.value = []
            total.value = 0
        } finally {
            loading.value = false
        }
    }

    // 处理点击进入下一级
    const handleSpaceClick = (space: SpaceInfo) => {
        // 如果是物品 (Type=2)，阻止下钻
        if (space.type === 2) {
            ElMessage.info(`查看物品详情: ${space.name}`)
            return
        }

        // 容器，进入下一级: 构造 PathNode 并推入面包屑
        const newNode: PathNode = {
            id: space.id,
            name: space.name,
            fatherId: currentId.value || 0, // 当前的 currentId 是新节点的 fatherId
            layer: breadcrumbs.value.length + 1
        }
        breadcrumbs.value.push(newNode)

        // 重置分页，并触发刷新
        pagination.value.page = 1
        fetchSpaces()
    }

    // 处理面包屑点击 (返回/跳转)
    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            // 点击 "我的场所" -> 回到根目录
            breadcrumbs.value = []
        } else {
            // 点击中间某个节点 -> 截断数组到目标层级
            breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
        }

        // 重置分页并刷新
        pagination.value.page = 1
        fetchSpaces()
    }

    // 分页处理函数
    const handleSizeChange = (newSize: number) => {
        pagination.value.pageSize = newSize
        pagination.value.page = 1
        fetchSpaces()
    }

    const handleCurrentChange = (newPage: number) => {
        pagination.value.page = newPage
        fetchSpaces()
    }

    // 暴露状态和方法
    return {
        pagination,
        total,
        loading,
        currentSpaces,
        breadcrumbs,
        currentId,
        fatherId,
        fetchSpaces,
        handleSpaceClick,
        handleBreadcrumbClick,
        handleSizeChange,
        handleCurrentChange,
    }
}
