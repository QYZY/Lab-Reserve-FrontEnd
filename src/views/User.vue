<template>
    <div class="user-management">
      <h2>用户管理</h2>
      <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
  
      <el-table :data="users" style="width: 100%" border>
        <el-table-column prop="id" label="用户ID" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="角色" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" @click="editUser(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" v-model="addUserDialogVisible">
        <el-form :model="newUser">
          <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
            <el-input v-model="newUser.username"></el-input>
          </el-form-item>
          <el-form-item label="角色" :rules="[{ required: true, message: '请选择角色', trigger: 'change' }]">
            <el-select v-model="newUser.role" placeholder="请选择角色">
              <el-option label="管理员" value="admin" />
              <el-option label="用户" value="user" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addUser">确定</el-button>
        </template>
      </el-dialog>
  
      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户" v-model="editUserDialogVisible">
        <el-form :model="currentUser">
          <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
            <el-input v-model="currentUser.username"></el-input>
          </el-form-item>
          <el-form-item label="角色" :rules="[{ required: true, message: '请选择角色', trigger: 'change' }]">
            <el-select v-model="currentUser.role" placeholder="请选择角色">
              <el-option label="管理员" value="admin" />
              <el-option label="用户" value="user" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editUserDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateUser">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const users = ref([]); // 存储用户列表
  const currentUser = ref(null); // 当前用户
  const newUser = ref({ username: '', role: '' }); // 新用户数据
  const addUserDialogVisible = ref(false); // 控制添加用户对话框的显示
  const editUserDialogVisible = ref(false); // 控制编辑用户对话框的显示
  
  // 获取用户列表
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/list'); // 获取用户列表
      users.value = response.data; // 更新用户数据
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  };
  
  const showAddUserDialog = () => {
    newUser.value = { username: '', role: '' }; // 重置新用户数据
    addUserDialogVisible.value = true; // 打开添加用户对话框
  };
  
  const addUser = async () => {
    try {
      await axios.post('http://localhost:8080/api/user', newUser.value); // 调用添加用户的 API
      addUserDialogVisible.value = false; // 关闭对话框
      await fetchUsers(); // 重新获取用户列表
    } catch (error) {
      console.error('添加用户失败:', error);
      alert('添加用户失败，请稍后再试');
    }
  };
  
  const editUser = (user) => {
    currentUser.value = { ...user }; // 复制用户数据到当前用户
    editUserDialogVisible.value = true; // 打开编辑用户对话框
  };
  
  const updateUser = async () => {
    try {
      await axios.put(`http://localhost:8080/api/user/${currentUser.value.id}`, currentUser.value); // 调用更新用户的 API
      editUserDialogVisible.value = false; // 关闭对话框
      await fetchUsers(); // 重新获取用户列表
    } catch (error) {
      console.error('更新用户失败:', error);
      alert('更新用户失败，请稍后再试');
    }
  };
  
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/user/${userId}`); // 调用删除用户的 API
      await fetchUsers(); // 重新获取用户列表
    } catch (error) {
      console.error('删除用户失败:', error);
      alert('删除用户失败，请稍后再试');
    }
  };
  
  // 组件挂载时获取用户列表
  onMounted(() => {
    fetchUsers(); // 获取用户列表
  });
  </script>
  
  <style scoped>
  .user-management {
    padding: 20px;
  }
  
  .el-table {
    margin-top: 20px;
  }
  </style>