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
          <p>班级名称: {{ course.className }}</p>
          <p>授课教师ID: {{ course.teacherId }}</p>
          <p>学习时长: {{ course.studyHour }} 小时</p>
        </div>
      </el-card>
    </div>

    <!-- 添加课程对话框 -->
    <el-dialog title="添加课程" v-model="addCourseDialogVisible">
      <el-form :model="newCourse" label-width="100px">
        <el-form-item label="课程名称" :rules="[{ required: true, message: '请输入课程名称', trigger: 'blur' }]">
          <el-input v-model="newCourse.name"></el-input>
        </el-form-item>
        <el-form-item label="班级名称" :rules="[{ required: true, message: '请输入班级名称', trigger: 'blur' }]">
          <el-input v-model="newCourse.className"></el-input>
        </el-form-item>
        <el-form-item label="学习时长" :rules="[{ required: true, message: '请输入学习时长', trigger: 'blur' }]">
          <el-input v-model="newCourse.studyHour" type="number"></el-input>
        </el-form-item>
        <el-form-item label="授课教师ID" :rules="[{ required: true, message: '请输入授课教师ID', trigger: 'blur' }]">
          <el-input v-model="newCourse.teacherId" type="number"></el-input>
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
        <p><strong>班级名称:</strong> {{ selectedCourse.className }}</p>
        <p><strong>学习时长:</strong> {{ selectedCourse.studyHour }} 小时</p>
        <p><strong>授课教师ID:</strong> {{ selectedCourse.teacherId }}</p>
      </div>
      <template #footer>
        <el-button @click="courseDetailsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses = ref([]) // 存储课程数据
const addCourseDialogVisible = ref(false)
const courseDetailsDialogVisible = ref(false)
const newCourse = ref({ name: '', className: '', studyHour: 0, teacherId: 0 })
const selectedCourse = ref(null)
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // 设置全局 Authorization 头
}

// 显示添加课程对话框
const showAddCourseDialog = () => {
  newCourse.value = { name: '', className: '', studyHour: 0, teacherId: 0 } // 重置课程信息
  addCourseDialogVisible.value = true
}

// 添加课程
const addCourse = async () => {
  try {
    if (!newCourse.value.name || !newCourse.value.className || newCourse.value.studyHour === 0 || newCourse.value.teacherId === 0) {
      alert('请填写完整课程信息')
      return
    }

    const courseData = {
      id: 0, // 后端生成ID，前端传0即可
      name: newCourse.value.name,
      stuNumber: 0, // 示例数据
      studyHour: newCourse.value.studyHour,
      className: newCourse.value.className,
      teacherId: newCourse.value.teacherId,
    }

    const response = await axios.post('http://127.0.0.1:8080/api/course/add', courseData)
    console.log('添加课程成功:', response.data)
    courses.value.push(response.data) // 更新课程列表

    addCourseDialogVisible.value = false
    newCourse.value = { name: '', className: '', studyHour: 0, teacherId: 0 }
  } catch (error) {
    console.error('添加课程失败:', error)
    alert('添加课程失败，请稍后再试')
  }
}

// 显示课程详情
const showCourseDetails = (course: any) => {
  selectedCourse.value = course
  courseDetailsDialogVisible.value = true
}

// 获取课程数据

const fetchCourses = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8080/api/course/list') // 替换为后端地址
    courses.value = response.data
    console.log('获取课程数据成功:', courses.value)
  } catch (error) {
    console.error('获取课程数据失败:', error)
  }
}

// 组件挂载时获取课程数据
onMounted(() => {
  fetchCourses()
})
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