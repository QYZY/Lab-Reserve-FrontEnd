<template>
    <div>
      <h2>当前角色: {{ currentRole }}</h2>
      <select v-model="selectedRole" @change="changeRole">
        <option value="TEACHER">教师</option>
        <option value="LAB_ADMIN">实验室管理员</option>
        <option value="SUPER_ADMIN">超级管理员</option>
      </select>
      <div v-if="currentRole === 'TEACHER'">
        <p>你可以管理课程</p>
      </div>
      <div v-if="currentRole === 'LAB_ADMIN'">
        <p>你可以管理实验室</p>
      </div>
      <div v-if="currentRole === 'SUPER_ADMIN'">
        <p>你可以管理所有用户和实验室</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useUserStore } from "@/stores/user";
  
  // 获取 Pinia store
  const userStore = useUserStore();
  
  // 当前角色
  const currentRole = computed(() => userStore.getRole);
  
  // 选中的角色
  const selectedRole = ref(userStore.getRole);
  
  // 切换角色
  const changeRole = () => {
    userStore.setUserRole(selectedRole.value); // 更新角色
    console.log(`角色已切换为：${selectedRole.value}`);
  };
  </script>