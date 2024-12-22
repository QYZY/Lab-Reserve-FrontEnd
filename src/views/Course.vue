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
    <el-dialog title="添加课程" :visible.sync="addCourseDialogVisible">
      <el-form :model="newCourse">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCourseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 课程详细信息对话框 -->
    <el-dialog title="课程详细信息" :visible.sync="courseDetailsDialogVisible">
        123
      <div v-if="selectedCourse">
        <p><strong>课程名称:</strong> {{ selectedCourse.name }}</p>
        <p><strong>授课教师:</strong> {{ selectedCourse.teacher }}</p>
        <p><strong>上课时间:</strong> {{ selectedCourse.time }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="courseDetailsDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const courses = ref([
  { id: 1, name: '数学', teacher: '张老师', time: '周一 9:00-11:00' },
  { id: 2, name: '英语', teacher: '李老师', time: '周二 10:00-12:00' },
]);

const addCourseDialogVisible = ref(false);
const courseDetailsDialogVisible = ref(false);
const newCourse = ref({ name: '', teacher: '', time: '' });
const selectedCourse = ref(null);

const showAddCourseDialog = () => {
  newCourse.value = { name: '', teacher: '', time: '' }; // 重置新课程数据
  addCourseDialogVisible.value = true;
};

const addCourse = () => {
  const newId = courses.value.length + 1; // 简单生成 ID
  courses.value.push({ ...newCourse.value, id: newId });
  addCourseDialogVisible.value = false;
};

const showCourseDetails = (course) => {
    
  selectedCourse.value = course; // 设置选中的���程
  courseDetailsDialogVisible.value = true; // 显示详细信息对话框
  console.log(selectedCourse);
  
};
</script>

<style scoped>
.course-management {
  padding: 20px;
}

.course-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 使用网格布局 */
  gap: 20px; /* 卡片之间的间距 */
}

.course-card {
  cursor: pointer; /* 鼠标悬停时显示为可点击 */
  transition: transform 0.2s; /* 添加过渡效果 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.course-card:hover {
  transform: scale(1.05); /* 鼠标悬停时放大效果 */
}

.card-header {
  display: flex;
  justify-content: space-between; /* 使标题和按钮分开 */
  align-items: center; /* 垂直居中 */
}

.card-content {
  padding: 20px; /* 卡片内容内边距 */
}
</style>