<template>
  <div class="lab-booking">
    <h2>实验室预约管理</h2>

    <el-form :model="filters" label-width="100px">
      <!-- 选择实验室 -->
      <el-form-item label="选择实验室">
        <el-tabs v-model="filters.selectedLab" type="card">
          <el-tab-pane
            v-for="lab in labs"
            :key="lab.id"
            :label="lab.name"
            :name="lab.id"
          />
        </el-tabs>
      </el-form-item>

      <!-- 选择周数 -->
      <el-form-item label="选择周数">
        <el-tabs v-model="filters.selectedWeek" type="card">
          <el-tab-pane
            v-for="week in weeks"
            :key="week"
            :label="'第 ' + week + ' 周'"
            :name="week"
          />
        </el-tabs>
      </el-form-item>
      <el-button type="primary" @click="fetchReservations">查询预约</el-button>
    </el-form>

    <!-- 显示课程表 -->
    <div class="schedule" v-if="showSchedule">
      <h3>课程表</h3>
      <el-table
        :data="scheduleData"
        border
        :row-class-name="rowClassName"
        class="schedule-table"
        table-layout="fixed"
      >
        <el-table-column label="时间/星期" width="200">
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
            <!-- 预约按钮 -->
            <el-button
              v-if="!row[day]"
              @click="openBookingModal(row, day)"
              type="info"
              >预约</el-button
            >
            <!-- 查看预约详细信息 -->
            <el-button v-else @click="openDetailsModal(row, day)" type="danger"
              >已预约</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 预约窗口 -->
    <el-dialog title="预约课程" v-model="isBookingModalVisible" width="50%">
      <el-form :model="bookingInfo">
        <el-form-item label="选择课程">
          <el-select v-model="bookingInfo.courseId" placeholder="请选择课程">
            <el-option
              v-for="course in courses.filter(
                (course) => course.teacherId === userStore.user.id
              )"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>

        <span slot="footer" class="dialog-footer">
          <el-button @click="isBookingModalVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBooking">确认预约</el-button>
        </span>
      </el-form>
    </el-dialog>

    <!-- 查看预约详细信息 -->
    <el-dialog title="课程详情" v-model="isDetailsModalVisible" width="50%">
      <div v-if="selectedBooking">
        <p><strong>课程名称:</strong> {{ selectedBooking.courseName }}</p>
        <p><strong>授课教师:</strong> {{ selectedBooking.teacherName }}</p>

        <p><strong>备注:</strong> {{ selectedBooking.note }}</p>
      </div>
      <template #footer>
        <el-button @click="isDetailsModalVisible = false">关闭</el-button>
        <el-button
          v-if="selectedBooking.userId === userStore.user.id"
          type="danger"
          @click="cancelBooking(selectedBooking.id)"
          >取消预约</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "@/axios";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

// 选择的实验室和周数
const filters = reactive({
  selectedLab: null,
  selectedWeek: null,
});

// 可用实验室列表
const labs = ref([]);

// 可选周数
const weeks = ref([1, 2, 3, 4, 5, 6, 7]);

// 课程数据（从服务器获取）
const courses = ref([]);

// 课程表时间段和星期
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

// 课程表数据
const scheduleData = ref([]);
const reservations = ref([]);
const users = ref([]);
// 预约和查看详细信息的对话框控制
const isBookingModalVisible = ref(false);
const isDetailsModalVisible = ref(false);
const showSchedule = ref(false);

// 选择的预约信息
const bookingInfo = reactive({
  userId: null,
  courseId: null,
  labId: null,
  periodId: null,
  weekNumber: null,
  weekDay: null,
});

const selectedBooking = ref({
  userId: "",
  courseName: "",
  teacherName: "",
  note: "",
});

// 初始化课程表数据
const initializeSchedule = () => {
  scheduleData.value = timeSlots.value.map((timeSlot) => {
    let row = { time: timeSlot };
    daysOfWeek.value.forEach((day) => {
      row[day] = null; // 初始状态为空（表示未预约）
    });
    return row;
  });
  console.log(scheduleData.value);
};

const getPeriodId = (timeName) => {
  const index = timeSlots.value.indexOf(timeName);
  return index !== -1 ? index + 1 : null; // 返回索引+1，未找到返回 null
};

const getDayId = (dayName) => {
  const index = daysOfWeek.value.indexOf(dayName);
  return index !== -1 ? index + 1 : null; // 返回索引+1，未找到返回 null
};
// 查询可用实验室，获取课程表数据（模拟数据）

const fetchLabs = async () => {
  try {
    const response = await axios.get("/lab/list");
    labs.value = response.data;
  } catch (error) {
    console.error("获取可用实验室失败", error);
  }
};

// 获取课程数据
const fetchCourses = async () => {
  try {
    const response = await axios.get(`/course/list`);
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

// 获取预约信息
const fetchReservations = async () => {
  console.log(filters);

  const labId = filters.selectedLab;
  const weekNumber = filters.selectedWeek;

  if (!labId || !weekNumber) {
    alert("请选择实验室和周数");
    return;
  }

  try {
    const response = await axios.get(`/reservation/week`, {
      params: {
        labId,
        weekNumber,
      },
    });

    // 处理返回的数据并更新 reservations
    reservations.value = response.data;
    console.log(reservations.value);

    // 转换预约数据为课程表数据
    const schedule = timeSlots.value.map((timeSlot) => {
      let row = { time: timeSlot };
      daysOfWeek.value.forEach((day) => {
        row[day] = null; // 初始状态为空
      });
      return row;
    });

    reservations.value.forEach((reservation) => {
      const { weekDay, periodId, courseId, userId ,id} = reservation;
      const day = daysOfWeek.value[weekDay - 1]; // 获取对应的星期
      const time = timeSlots.value[periodId - 1]; // 获取对应的时间段

      // 获取课程名称
      const courseName = getCourseNameById(courseId);
      const teacherName = getUsernameById(userId);

      console.log(day, time, courseName);
      schedule.forEach((row) => {
        if (row.time === time) {
          row[day] = {
            id: id,
            courseName: courseName,
            teacherName: teacherName,
            userId: userId,
          };
        }
      });
    });

    scheduleData.value = schedule; // 更新课程表数据
    showSchedule.value = true;
    console.log(scheduleData.value);
  } catch (error) {
    console.error("Error fetching reservations:", error);
  }
};

// 提交预约
const submitBooking = async () => {
  try {
    const response = await axios.post("/reservation/add", bookingInfo);
    alert(response.data);
    isBookingModalVisible.value = false; // 关闭预约窗口
    fetchReservations();
  } catch (error) {
    console.error("预约失败:", error);
  }
};

const cancelBooking = async(reservationId) => {
  try {
    await axios.patch(`/reservation/${reservationId}/cancel`);
    alert("预约已取消");
    isDetailsModalVisible.value = false
    fetchReservations(); // 更新预约列表
  } catch (error) {
    console.error("取消预约失败:", error);
    alert("取消预约失败，请稍后再试");
  }
}
// 打开预约窗口
const openBookingModal = (row, day) => {
  const labId = filters.selectedLab;
  const weekNumber = filters.selectedWeek;

  if (!labId || !weekNumber) {
    alert("请选择实验室和周数");
    return;
  }

  bookingInfo.periodId = getPeriodId(row.time);
  bookingInfo.weekDay = getDayId(day);
  bookingInfo.courseId = null;
  bookingInfo.userId = userStore.user.id;
  bookingInfo.labId = labId;

  bookingInfo.weekNumber = weekNumber;
  isBookingModalVisible.value = true;
  console.log(bookingInfo);
};


// 打开查看详细信息窗口
const openDetailsModal = (row, day) => {
  const booking = row[day];
  selectedBooking.value.id = booking.id;
  selectedBooking.value.courseName = booking.courseName;
  selectedBooking.value.note = booking.note || "无备注";
  selectedBooking.value.userId = booking.userId;
  selectedBooking.value.teacherName = booking.teacherName || "未知教师";
  isDetailsModalVisible.value = true;
  console.log(selectedBooking.value);
};

// 生命周期钩子：组件挂载时初始化课程表
onMounted(() => {
  fetchUsers();
  fetchLabs();
  fetchCourses();
  initializeSchedule();
});
</script>

<style scoped>
.lab-booking {
  height: 100%;
  padding: 20px;
}

.schedule {
  margin-top: 20px;
}

.el-button {
  margin: 5px;
}
</style>
