<template>
    <div class="user-management">
      <h2>用户管理</h2>
      <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>
  
      <el-table :data="users" style="width: 100%" border>
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
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
          <el-form-item label="姓名" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
            <el-input v-model="newUser.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
            <el-input v-model="newUser.email"></el-input>
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
          <el-form-item label="姓名" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
            <el-input v-model="currentUser.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
            <el-input v-model="currentUser.email"></el-input>
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
  
  // 模拟从服务器获取用户数据
  const fetchUsers = async () => {
    // 这里可以替换为实际的 API 调用
    return [
      { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
      { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
      { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' },
    ];
  };
  
  const users = ref([]);
  const addUserDialogVisible = ref(false);
  const editUserDialogVisible = ref(false);
  const newUser = ref({ name: '', email: '', role: '' });
  const currentUser = ref(null);
  
  // 页面加载时获取用户数据
  onMounted(async () => {
    users.value = await fetchUsers();
  });
  
  const showAddUserDialog = () => {
    newUser.value = { name: '', email: '', role: '' }; // 重置新用户数据
    addUserDialogVisible.value = true; // 打开添加用户对话框
  };
  
  const addUser = () => {
    const newId = users.value.length + 1; // 简单生成 ID
    users.value.push({ ...newUser.value, id: newId });
    addUserDialogVisible.value = false; // 关闭对话框
  };
  
  const editUser = (user) => {
    currentUser.value = { ...user }; // 复制用户数据
    editUserDialogVisible.value = true; // 打开编辑用户对话框
  };
  
  const updateUser = () => {
    const index = users.value.findIndex(user => user.id === currentUser.value.id);
    if (index !== -1) {
      users.value[index] = { ...currentUser.value }; // 更新用户数据
    }
    editUserDialogVisible.value = false; // 关闭对话框
  };
  
  const deleteUser = (id) => {
    const index = users.value.findIndex(user => user.id === id);
    if (index !== -1) {
      users.value.splice(index, 1); // 删除用户
    }
  };
  </script>
  
  <style scoped>
  .user-management {
    padding: 20px;
  }
  
  .el-table {
    margin-top: 20px;
  }
  </style>