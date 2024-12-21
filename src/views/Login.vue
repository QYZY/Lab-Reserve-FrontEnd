<!-- src/views/Login.vue -->
<template>
  <div class="login-container">
    <h1>登录</h1>
    <el-form @submit.native.prevent="login">
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

<script>
import axios from '../axios'; // 引入自定义的 Axios 实例

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/login', {
          username: this.username,
          password: this.password,
        });
        // 保存 token
        localStorage.setItem('token', response.data.token);
        this.$router.push('/'); // 登录成功后跳转到主界面
      } catch (error) {
        alert('登录失败！');
      }
    },
  },
};
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