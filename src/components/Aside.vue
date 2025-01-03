<template>
  <el-aside class="sidebar" :class="{ 'collapsed': sidebarStore.isCollapsed }">
    <div class="header">
      <h2 class="title">欢迎</h2>
    </div>
    <el-menu>
      <el-menu-item
        v-for="item in filteredRoutes"
        :key="item.path"
        :index="item.path"
        class="menu-item"
        @click="handleMenuClick(item)"
      >
        <component :is="item.meta.icon" v-if="item.meta.icon" class="menu-icon"></component>
        <span v-if="!sidebarStore.isCollapsed">{{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { computed } from "vue";
import { routes } from "@/router"; // 导入路由配置
import { useUserStore } from "@/stores/user";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { useRouter } from "vue-router"; // 导入路由
import { useSidebarStore } from "@/stores/sidebar"; // 导入侧边栏状态管理

const userStore = useUserStore();
const router = useRouter(); // 创建路由实例
const breadcrumbsStore = useBreadcrumbsStore(); 
const sidebarStore = useSidebarStore(); // 创建侧边栏状态管理实例

const filteredRoutes = computed(() => {
  return routes[0].children.filter((route) => {
    const roles = route.meta.roles;
    return !roles || roles.includes(userStore.user.role);
  });
});

const handleMenuClick = (item) => {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: item.name, path: item.path },
  ];
  breadcrumbsStore.setBreadcrumbs(breadcrumbs);
  router.push(item.path);
};

</script>

<style lang="less">
.sidebar {
  background-color: #f5f7fa;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: width 0.3s; /* 添加过渡效果 */
  padding-top: 20px; /* 顶部间距 */
}

.sidebar.collapsed {
  width: 80px; /* 收缩后的宽度 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.title {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.menu-item {
  height: 40px;
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  transition: background-color 0.5s;
  padding: 0px;
}

.menu-item:hover {
  background-color: #e4e7ed;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px; /* 图标与文本之间的间距 */
  color: #409eff;
}

.menu-item span {
  transition: opacity 0.3s;
}

.menu-item span {
  /* 控制文本的隐藏 */
  opacity: 1;
}

.sidebar.collapsed .menu-item span {
  opacity: 0; /* 隐藏文本 */
}

.toggle-btn {
  padding: 0;
  font-size: 16px;
  background-color: transparent;
  border: none;
  color: #409eff;
}
</style>

