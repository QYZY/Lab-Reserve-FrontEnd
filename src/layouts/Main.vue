<template>
  <div class="common-layout">
    <el-container class="common-container">
      <el-aside
        class="common-aside"
        :class="{ collapsed: sidebarStore.isCollapsed }"
      >
      <Aside></Aside>
      </el-aside>
      <el-container class="common-main-container">
        <el-header class="common-header">
          <Header></Header>
        </el-header>
        <el-main class="common-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";
import { useSidebarStore } from "@/stores/sidebar"; // 导入侧边栏状态管理
const sidebarStore = useSidebarStore(); // 创建侧边栏状态管理实例
</script>

<style>
.common-layout {
  height: 100vh;
  width: 100%;
}

.common-container {
  height: 100%;
  display: flex;
  transition: width 0.3s; /* 添加过渡效果 */
}

.common-aside {
  width: 15%; /* 默认宽度 */
  transition: width 0.3s; /* 添加过渡效果 */
}

.common-aside.collapsed {
  width: 64px; /* 收缩后的宽度 */
}

.common-main-container {
  flex-grow: 1; /* 右侧内容区域自适应宽度 */
  transition: margin-left 0.3s; /* 添加过渡效果 */
}

.common-header {
  height: 100px;
}

.common-main {
  height: calc(100vh - 100px); /* 计算主内容区域的高度 */
}
</style>