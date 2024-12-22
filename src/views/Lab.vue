<template>
    <div class="lab-management">
      <h2>实验室管理</h2>
      <el-button type="primary" @click="showAddLabDialog">添加实验室</el-button>
  
      <el-table :data="labs" style="width: 100%" border>
        <el-table-column prop="name" label="实验室名称" />
        <el-table-column prop="capacity" label="容量" />
        <el-table-column prop="equipment" label="设备" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" @click="editLab(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteLab(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加实验室对话框 -->
      <el-dialog title="添加实验室" v-model="addLabDialogVisible">
        <el-form :model="newLab">
          <el-form-item label="实验室名称" :rules="[{ required: true, message: '请输入实验室名称', trigger: 'blur' }]">
            <el-input v-model="newLab.name"></el-input>
          </el-form-item>
          <el-form-item label="容量" :rules="[{ required: true, message: '请输入容量', trigger: 'blur' }]">
            <el-input v-model="newLab.capacity" type="number"></el-input>
          </el-form-item>
          <el-form-item label="设备" :rules="[{ required: true, message: '请输入设备', trigger: 'blur' }]">
            <el-input v-model="newLab.equipment"></el-input>
          </el-form-item>
          <el-form-item label="状态" :rules="[{ required: true, message: '请选择状态', trigger: 'change' }]">
            <el-select v-model="newLab.status" placeholder="请选择状态">
              <el-option label="可用" value="available" />
              <el-option label="不可用" value="unavailable" />
            </el-select>
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
          <el-form-item label="容量" :rules="[{ required: true, message: '请输入容量', trigger: 'blur' }]">
            <el-input v-model="currentLab.capacity" type="number"></el-input>
          </el-form-item>
          <el-form-item label="设备" :rules="[{ required: true, message: '请输入设备', trigger: 'blur' }]">
            <el-input v-model="currentLab.equipment"></el-input>
          </el-form-item>
          <el-form-item label="状态" :rules="[{ required: true, message: '请选择状态', trigger: 'change' }]">
            <el-select v-model="currentLab.status" placeholder="请选择状态">
              <el-option label="可用" value="available" />
              <el-option label="不可用" value="unavailable" />
            </el-select>
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
  import { ref } from 'vue';
  
  // 模拟实验室数据
  const labs = ref([
    { id: 1, name: '实验室 A', capacity: 30, equipment: '投影仪, 实验台', status: 'available' },
    { id: 2, name: '实验室 B', capacity: 25, equipment: '计算机, 实验台', status: 'available' },
    { id: 3, name: '实验室 C', capacity: 20, equipment: '实验台', status: 'unavailable' },
  ]);
  
  const addLabDialogVisible = ref(false);
  const editLabDialogVisible = ref(false);
  const newLab = ref({ name: '', capacity: '', equipment: '', status: '' });
  const currentLab = ref(null);
  
  const showAddLabDialog = () => {
    newLab.value = { name: '', capacity: '', equipment: '', status: '' }; // 重置新实验室数据
    addLabDialogVisible.value = true; // 打开添加实验室对话框
  };
  
  const addLab = () => {
    const newId = labs.value.length + 1; // 简单生成 ID
    labs.value.push({ ...newLab.value, id: newId });
    addLabDialogVisible.value = false; // 关闭对话框
  };
  
  const editLab = (lab) => {
    currentLab.value = { ...lab }; // 复制实验室数据
    editLabDialogVisible.value = true; // 打开编辑实验室对话框
  };
  
  const updateLab = () => {
    const index = labs.value.findIndex(lab => lab.id === currentLab.value.id);
    if (index !== -1) {
      labs.value[index] = { ...currentLab.value }; // 更新实验室数据
    }
    editLabDialogVisible.value = false; // 关闭对话框
  };
  
  const deleteLab = (id) => {
    const index = labs.value.findIndex(lab => lab.id === id);
    if (index !== -1) {
      labs.value.splice(index, 1); // 删除实验室
    }
  };
  </script>
  
  <style scoped>
  .lab-management {
    padding: 20px;
  }
  
  .el-table {
    margin-top: 20px;
  }
  </style>