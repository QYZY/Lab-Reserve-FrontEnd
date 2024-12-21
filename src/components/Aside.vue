<template>
  <el-aside class="sidebar">
    <div class="header">
      <h2 class="title">实验室预约管理系统</h2>
    </div>
    <el-menu>
      <el-menu-item
        v-for="item in filteredRoutes"
        :key="item.path"
        :index="item.path"
        class="menu-item"
        @click="handleMenuClick(item)"
      >
        <i :class="item.meta.icon || 'el-icon-menu'"></i>
        <span slot="title">{{ item.meta.title }}</span>
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
const userStore = useUserStore();
const router = useRouter(); // 创建路由实例
const breadcrumbsStore = useBreadcrumbsStore(); 

const filteredRoutes = computed(() => {
  return routes.filter((route) => {
    const roles = route.meta.roles;
    return !roles || roles.includes(userStore.user.role);
  });
});

const handleMenuClick = (item) => {
  // 假设根据点击的菜单项，设置不同的面包屑数据
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: item.name, path: item.path },
  ];
  // 更新 Pinia 中的面包屑
  breadcrumbsStore.setBreadcrumbs(breadcrumbs);
  router.push(item.path);
};

</script>

<style lang="less">
.sidebar {
  background-color: #f5f7fa;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.header {
  padding: 20px;
  text-align: center;
}

.title {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.menu-item {
    height: 40px;
    transition: background-color 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
}

.menu-item:hover {
  background-color: #e4e7ed;
}

.menu-item i {
  margin-right: 10px;
  color: #409eff;
}
</style>
