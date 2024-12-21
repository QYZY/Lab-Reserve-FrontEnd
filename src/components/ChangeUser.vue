<template>
    <div>
      <h2>当前角色: {{ currentRole }}</h2>
      <select v-model="selectedRole" @change="changeRole">
        <option value="teacher">教师</option>
        <option value="lab-admin">实验室管理员</option>
        <option value="super-admin">超级管理员</option>
      </select>
      <div v-if="currentRole === 'teacher'">
        <p>你可以管理课程</p>
      </div>
      <div v-if="currentRole === 'lab-admin'">
        <p>你可以管理实验室</p>
      </div>
      <div v-if="currentRole === 'super-admin'">
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