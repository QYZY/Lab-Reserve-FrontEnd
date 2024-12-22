<template>
    <div class="review-management">
      <h2>审核管理</h2>
  
      <el-table :data="pendingReviews" style="width: 100%" border>
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="submitter" label="提交人" />
        <el-table-column prop="submissionDate" label="提交时间" />
        <el-table-column prop="status" label="状态" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="text" @click="viewDetails(scope.row)">查看详情</el-button>
            <el-button type="text" @click="approveReview(scope.row)">通过</el-button>
            <el-button type="text" @click="rejectReview(scope.row)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 审核详情对话框 -->
      <el-dialog title="审核详情" v-model="detailsDialogVisible">
        <div v-if="currentReview">
          <p><strong>项目名称:</strong> {{ currentReview.projectName }}</p>
          <p><strong>提交人:</strong> {{ currentReview.submitter }}</p>
          <p><strong>提交时间:</strong> {{ currentReview.submissionDate }}</p>
          <p><strong>描述:</strong> {{ currentReview.description }}</p>
        </div>
        <template #footer>
          <el-button @click="detailsDialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 模拟待审核项目数据
  const pendingReviews = ref([
    { id: 1, projectName: '项目 A', submitter: '张三', submissionDate: '2023-10-01', status: '待审核', description: '这是项目 A 的描述' },
    { id: 2, projectName: '项目 B', submitter: '李四', submissionDate: '2023-10-02', status: '待审核', description: '这是项目 B 的描述' },
    { id: 3, projectName: '项目 C', submitter: '王五', submissionDate: '2023-10-03', status: '待审核', description: '这是项目 C 的描述' },
  ]);
  
  const detailsDialogVisible = ref(false);
  const currentReview = ref(null);
  
  const viewDetails = (review) => {
    currentReview.value = review; // 设置当前审核项目
    detailsDialogVisible.value = true; // 打开详情对话框
  };
  
  const approveReview = (review) => {
    // 处理通过审核的逻辑
    console.log('通过审核:', review.projectName);
    // 这里可以添加更新状态的逻辑
  };
  
  const rejectReview = (review) => {
    // 处理拒绝审核的逻辑
    console.log('拒绝审核:', review.projectName);
    // 这里可以添加更新状态的逻辑
  };
  </script>
  
  <style scoped>
  .review-management {
    padding: 20px;
  }
  
  .el-table {
    margin-top: 20px;
  }
  </style>