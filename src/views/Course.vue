<template>
    <div class="course-management">
      <h2>课程管理</h2>
      <el-button type="primary" @click="showAddCourseDialog">添加课程</el-button>
  
      <div class="course-cards">
        <el-card
          v-for="course in courses"
          :key="course.id"
          class="course-card"
          @click="showCourseDetails(course)"
        >
          <div class="card-header">
            <h3>{{ course.name }}</h3>
            <el-button type="text" @click.stop="showCourseDetails(course)">查看详情</el-button>
          </div>
          <div class="card-content">
            <p>授课教师: {{ course.teacher }}</p>
            <p>上课时间: {{ course.time }}</p>
          </div>
        </el-card>
      </div>
  
      <!-- 添加课程对话框 -->
      <el-dialog title="添加课程" v-model="addCourseDialogVisible">
        <el-form :model="newCourse" label-width="100px">
          <el-form-item label="课程名称" :rules="[{ required: true, message: '请输入课程名称', trigger: 'blur' }]">
            <el-input v-model="newCourse.name"></el-input>
          </el-form-item>
          <el-form-item label="授课教师" :rules="[{ required: true, message: '请输入授课教师', trigger: 'blur' }]">
            <el-input v-model="newCourse.teacher"></el-input>
          </el-form-item>
          <el-form-item label="上课时间" :rules="[{ required: true, message: '请输入上课时间', trigger: 'blur' }]">
            <el-input v-model="newCourse.time"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addCourseDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addCourse">确定</el-button>
        </template>
      </el-dialog>
  
      <!-- 课程详情对话框 -->
      <el-dialog title="课程详情" v-model="courseDetailsDialogVisible">
        <div v-if="selectedCourse">
          <p><strong>课程名称:</strong> {{ selectedCourse.name }}</p>
          <p><strong>授课教师:</strong> {{ selectedCourse.teacher }}</p>
          <p><strong>上课时间:</strong> {{ selectedCourse.time }}</p>
        </div>
        <template #footer>
          <el-button @click="courseDetailsDialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  
  const courses = ref([
    { id: 1, name: '数学', teacher: '张老师', time: '周一 9:00-11:00' },
    { id: 2, name: '英语', teacher: '李老师', time: '周二 10:00-12:00' },
  ])
  
  const addCourseDialogVisible = ref(false)
  const courseDetailsDialogVisible = ref(false)
  const newCourse = ref({ name: '', teacher: '', time: '' })
  const selectedCourse = ref(null)
  
  const showAddCourseDialog = () => {
    newCourse.value = { name: '', teacher: '', time: '' } // 重置课程信息
    addCourseDialogVisible.value = true
  }
  
  const addCourse = () => {
    if (!newCourse.value.name || !newCourse.value.teacher || !newCourse.value.time) {
      alert('请填写完整课程信息')
      return
    }
    const newId = courses.value.length + 1
    courses.value.push({ ...newCourse.value, id: newId })
    addCourseDialogVisible.value = false
  }
  
  const showCourseDetails = (course: any) => {
    selectedCourse.value = course
    courseDetailsDialogVisible.value = true
  }
  </script>
  
  <style scoped>
  .course-management {
    padding: 20px;
  }
  
  .course-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .course-card {
    cursor: pointer;
    transition: transform 0.2s;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .course-card:hover {
    transform: scale(1.05);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-content {
    padding: 20px;
  }
  </style>
  