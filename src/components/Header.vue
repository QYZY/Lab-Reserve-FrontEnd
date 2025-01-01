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
    
    <div class="login-status">
      <template v-if="isLoggedIn">
        <span>欢迎, {{ currentUser.username }}</span>
        <el-button @click="logout" type="danger">注销</el-button>
      </template>
      <el-button v-else @click="goToLogin" type="primary">登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useSidebarStore } from "@/stores/sidebar";

const sidebarStore = useSidebarStore();
const userStore = useUserStore();
const router = useRouter();

const currentUser = computed(() => userStore.user);
const isLoggedIn = computed(() => userStore.isLoggedIn);

const toggleSidebar = () => {
  sidebarStore.toggle();
};

const goToLogin = () => {
  router.push({ name: "Login" });
};

const logout = () => {
  userStore.clearUserInfo();
  alert('您已注销！');
  router.push('/login'); // 注销后跳转到登录页面
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

.login-status span{
  margin-right: 10px;
}
</style>
