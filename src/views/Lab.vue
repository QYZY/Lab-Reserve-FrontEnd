<template>
    <div class="lab-management">
      <h2>实验室管理</h2>
      <el-button type="primary" @click="showAddLabDialog">添加实验室</el-button>
  
      <el-table v-if="managedLabs.length" :data="managedLabs" style="width: 100%" border>
        <el-table-column prop="id" label="实验室ID" />
        <el-table-column prop="name" label="实验室名称" />
        <el-table-column prop="description" label="实验室描述" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" @click="editLab(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteLab(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <p v-else>当前没有管理的实验室。</p>
  
      <!-- 添加实验室对话框 -->
      <el-dialog title="添加实验室" v-model="addLabDialogVisible">
        <el-form :model="newLab">
          <el-form-item label="实验室名称" :rules="[{ required: true, message: '请输入实验室名称', trigger: 'blur' }]">
            <el-input v-model="newLab.name"></el-input>
          </el-form-item>
          <el-form-item label="实验室描述" :rules="[{ required: true, message: '请输入实验室描述', trigger: 'blur' }]">
            <el-input v-model="newLab.description"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addLabDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addLab">确定</el-button>
        </template>
      </el-dialog>
  
      <!-- 编辑实验室对话框 -->
      <el-dialog title="编辑实验室" v-model="editLabDialogVisible">
        <el-form :model="currentLab">
          <el-form-item label="实验室名称" :rules="[{ required: true, message: '请输入实验室名称', trigger: 'blur' }]">
            <el-input v-model="currentLab.name"></el-input>
          </el-form-item>
          <el-form-item label="实验室描述" :rules="[{ required: true, message: '请输入实验室描述', trigger: 'blur' }]">
            <el-input v-model="currentLab.description"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editLabDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateLab">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useUserStore } from '@/stores/user';
  
  const userStore = useUserStore();
  const managedLabs = ref([]); // 存储当前用户管理的实验室
  
  // 获取当前用户管理的实验室
  const fetchManagedLabs = async () => {
    try {
      const adminId = userStore.user.id; // 假设用户ID为管理员ID
      const response = await axios.get(`http://127.0.0.1:8080/api/lab/admin/${adminId}`);
      managedLabs.value = response.data; // 更新管理的实验室数据
    } catch (error) {
      console.error('获取管理的实验室失败:', error);
    }
  };
  
  // 组件挂载时获取用户管理的实验室
  onMounted(() => {
    fetchManagedLabs(); // 获取当前用户管理的实验室
  });
  </script>
  
  <style scoped>
  .lab-management {
    padding: 20px;
  }
  
  .el-table {
    margin-top: 20px;
  }
  </style>