<template>
  <div class="header">
    <el-button
      @click="toggleSidebar"
      class="toggle-sidebar-btn"
    >
      <template v-if="!sidebarStore.isCollapsed">
        <el-icon><Fold /></el-icon>
      </template>
      <template v-else>
        <el-icon><Expand /></el-icon>
      </template>
    </el-button>
    <h2>实验室预约管理系统</h2>

    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbItems"
        :key="index"
        :to="item.path"
        @click.native="removeBreadcrumb(index)"
      >
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-button @click="goToLogin" type="primary">
      登录
    </el-button>
    
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { useSidebarStore } from "@/stores/sidebar";

const route = useRoute();
const router = useRouter();
const breadcrumbsStore = useBreadcrumbsStore();
const sidebarStore = useSidebarStore();

const breadcrumbs = computed(() => breadcrumbsStore.breadcrumbs);

const toggleSidebar = () => {
  sidebarStore.toggle();
};

const goToLogin = () => {
  router.push({ name: "Login" });
};
</script>

<style scoped>
.header {
  padding: 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

.header h2 {
  margin: 0;
}

.el-breadcrumb {
  margin-top: 10px;
}

.toggle-sidebar-btn {
  border: none;
  background-color: transparent;
  padding: 0px;
  cursor: pointer;
  width: 30px;
}

.toggle-sidebar-btn .el-icon {
  font-size: 20px;
  color: #333;
}

.login-button {
  margin-left: 20px;
}
</style>
