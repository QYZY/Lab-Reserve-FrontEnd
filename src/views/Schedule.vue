<template>
  <div class="schedule-page">
    <!-- 用户信息展示 -->
    <el-card class="user-info">
      <h2>{{ userStore.user.username }}的课程表</h2>
      <p>id: {{ userStore.user.id }}</p>
      <p>当前学期：{{ currentSemester }}</p>
      <p>当前周次：{{ currentWeekNumber }} 周</p>
    </el-card>

    <!-- 显示课程表 -->
    <div class="schedule">
      <h3>课程表</h3>
      <el-table :data="scheduleData" border>
        <el-table-column label="时间/星期" width="180">
          <template #default="{ row }">
            <div>{{ row.time }}</div>
          </template>
        </el-table-column>

        <el-table-column
          v-for="(day, index) in daysOfWeek"
          :key="index"
          :label="day"
          width="180"
        >
          <template #default="{ row }">
            <!-- 课程信息展示 -->
            <div v-if="row[day]">
              <div>{{ row[day].courseName }}</div>
              <div>{{ row[day].labName }}</div>
              <el-button size="mini" @click="openDetailsModal(row, day)"
                >查看详情</el-button
              >
            </div>
            <!-- 如果没有课程，显示 "无课程" -->
            <div v-else>
              <div></div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 课程详情弹窗 -->
    <el-dialog title="课程详情" v-model="courseDetailsDialogVisible">
      <div v-if="selectedCourse">
        <p><strong>课程名称:</strong> {{ selectedCourse.name }}</p>
        <p><strong>班级名称:</strong> {{ selectedCourse.className }}</p>
        <p><strong>学习时长:</strong> {{ selectedCourse.studyHour }} 小时</p>
        <p><strong>授课教师:</strong> {{ selectedCourse.teacherName }}</p>
        <p><strong>教室:</strong> {{ selectedCourse.classroom }}</p>
      </div>
      <template #footer>
        <el-button @click="courseDetailsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import axios from "@/axios";

const userStore = useUserStore();

// 用户信息
const labs = ref([]);
const courses = ref([]);
const users = ref([]);

const currentSemester = ref("2023-2024秋季学期");
const currentWeekNumber = ref(1);

const timeSlots = ref(["一二节", "三四节", "五六节", "七八节"]);

const daysOfWeek = ref([
  "周一",
  "周二",
  "周三",
  "周四",
  "周五",
  "周六",
  "周日",
]);
const scheduleData = ref([]);

// 控制课程详情弹窗
const courseDetailsDialogVisible = ref(false);
const selectedCourse = ref({});
const reservations = ref([]);

// 查看课程详情
const openDetailsModal = (row, day) => {
  const courseId = row[day].courseId;
  const course =  courses.value.find((course) => course.id === courseId);
  selectedCourse.value.name = getCourseNameById(course.id);
  selectedCourse.value.className = course.className;
  selectedCourse.value.studyHour = course.studyHour;
  selectedCourse.value.teacherName = getUsernameById(course.teacherId)
  selectedCourse.value.classroom = row[day].labName;
  console.log(selectedCourse);
  courseDetailsDialogVisible.value = true;
};

const fetchLabs = async () => {
  try {
    const response = await axios.get("/lab/list");
    labs.value = response.data;
  } catch (error) {
    console.error("获取可用实验室失败", error);
  }
};

const getLabNameById = (labId) => {
  const lab = labs.value.find((lab) => lab.id === labId);
  return lab ? lab.name : null; // 如果找到，返回课程名称，否则返回 null
};

// 获取课程数据
const fetchCourses = async () => {
  try {
    const response = await axios.get(`/course/teacher/${userStore.user.id}`);
    courses.value = response.data;
  } catch (error) {
    console.error("获取课程数据失败", error);
  }
};

// 根据 courseId 获取课程名称
const getCourseNameById = (courseId) => {
  const course = courses.value.find((course) => course.id === courseId);
  return course ? course.name : null; // 如果找到，返回课程名称，否则返回 null
};

// 获取用户列表并缓存
const fetchUsers = async () => {
  try {
    const response = await axios.get("/user/list");
    if (Array.isArray(response.data)) {
      users.value = response.data; // 将数据存储到 users 中
    } else {
      console.error("返回的数据格式错误");
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

// 根据 userId 获取用户名
const getUsernameById = (userId) => {
  const user = users.value.find((user) => user.id === userId);
  return user ? user.username : null;
};

// 获取预约数据并更新课表
const fetchReservations = async () => {
  try {
    const response = await axios.get(`reservation/user/${userStore.user.id}`);
    reservations.value = response.data;

    const schedule = timeSlots.value.map((timeSlot) => {
      let row = { time: timeSlot };
      daysOfWeek.value.forEach((day) => {
        row[day] = null; // 初始状态为空
      });
      return row;
    });

    reservations.value.forEach((reservation) => {
      const { weekDay, periodId, courseId, labId, weekNumber } = reservation;
      const day = daysOfWeek.value[weekDay - 1]; // 获取对应的星期
      const time = timeSlots.value[periodId - 1]; // 获取对应的时间段

      // 获取课程名称
      const courseName = getCourseNameById(courseId);
      const labName = getLabNameById(labId);

      schedule.forEach((row) => {
        if (row.time === time && weekNumber === currentWeekNumber.value) {
          row[day] = {
            courseName: courseName,
            labName: labName,
            courseId: courseId,
          };
        }
      });
    });

    scheduleData.value = schedule;
    console.log(scheduleData.value);
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
};

// 页面加载时调用
onMounted(() => {
  fetchLabs();
  fetchUsers();
  fetchReservations();
  fetchCourses();
});
</script>

<style scoped>
.schedule {
  margin-top: 20px;
}
.schedule h3 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.el-table {
  width: 100%;
}
.el-dialog {
  width: 50%;
}
</style>
