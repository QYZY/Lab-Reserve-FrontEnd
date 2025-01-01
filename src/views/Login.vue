<template>
  <div class="login-container">
    <h1>登录</h1>
    <div v-if="isLoggedIn">
      <span>欢迎, {{ currentUser.username }}</span>
      <el-button type="danger" @click="logout">注销</el-button>
    </div>
    <el-form v-else @submit.native.prevent="login">
      <el-form-item>
        <el-input v-model="username" placeholder="用户名" required />
      </el-form-item>
      <el-form-item>
        <el-input v-model="password" type="password" placeholder="密码" required />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import axios from '../axios'; // 自定义 Axios 实例

// 定义响应式数据
const username = ref('');
const password = ref('');
const userStore = useUserStore();
const router = useRouter();

// 计算属性
const currentUser = computed(() => userStore.user);
const isLoggedIn = computed(() => userStore.isLoggedIn);

// 登录方法
const login = async () => {
  try {
    const response = await axios.post('/login', {
      username: username.value,
      password: password.value,
    });

    const { user: userInfo, token } = response.data;

    userStore.setUserInfo(userInfo, token);
    alert('登录成功！');
    router.push("/"); // 登录成功后跳转到主页
  } catch (error) {
    alert('登录失败，请检查用户名和密码。');
  }
};

// 注销方法
const logout = () => {
  userStore.clearUserInfo();
  alert('您已注销！');
  router.push('/login'); // 注销后跳转到登录页面
};

// 页面加载时初始化用户
onMounted(() => {
  userStore.initializeUser();
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto; /* 垂直居中 */
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
