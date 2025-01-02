<template>
  <div class="lab-booking">
    <h2>实验室预约管理</h2>

    <el-form :model="filters" label-width="100px">
      <el-form-item label="选择课程">
        <el-tabs v-model="filters.selectedCourse" type="card">
          <el-tab-pane
            v-for="course in courses"
            :key="course.id"
            :label="course.name"
            :name="course.id"
          />
        </el-tabs>
      </el-form-item>

      <el-form-item label="选择周数">
        <el-checkbox-group v-model="filters.selectedWeeks">
          <el-checkbox v-for="week in weeks" :key="week" :label="week">
            第 {{ week }} 周
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="选择星期">
        <el-tabs v-model="filters.selectedDay" type="card">
          <el-tab-pane
            v-for="(day, index) in days"
            :key="day"
            :label="day"
            :name="index + 1"
          />
        </el-tabs>
      </el-form-item>

      <el-form-item label="选择时段">
        <el-tabs v-model="filters.selectedTimeSlot" type="card">
          <el-tab-pane
            v-for="(timeSlot, index) in TIME_SLOTS"
            :key="timeSlot.id"
            :label="timeSlot.label"
            :name="timeSlot.id"
          />
        </el-tabs>
      </el-form-item>

      <el-button type="primary" @click="fetchAvailableLabs"
        >查询可用实验室</el-button
      >
      <el-button type="primary" @click="fetchUserReservations"
        >我的预约</el-button
      >
    </el-form>

    <div class="available-labs" v-if="showAvailableLabs">
      <h3>可用实验室</h3>
      <el-card v-for="lab in availableLabs" :key="lab.id" class="lab-card">
        <div class="lab-content">
          <h4>{{ lab.name }}</h4>
          <p>管理员: {{ lab.adminName }}</p>
          <p>描述: {{ lab.description }}</p>
        </div>
        <div class="lab-actions">
          <el-button type="text" @click="showLabDetails(lab)"
            >查看详情</el-button
          >
          <el-button type="primary" @click="bookLab(lab)">预约</el-button>
        </div>
      </el-card>
    </div>

    <div class="user-reservations" v-if="showUserReservation">
      <h3>我的预约</h3>
      <el-card
        v-for="reservation in userReservations"
        :key="reservation.id"
        class="lab-card"
      >
        <div class="lab-content">
          <h4>{{ displayLabNameByid(reservation.labId) }}</h4>
          <p>课程: {{ displayCourseNameById(reservation.courseId) }}</p>
          <p>周数: 第 {{ reservation.weekNumber }} 周</p>
          <p>星期: {{ reservation.weekDay }}</p>
          <p>时段: {{ getPeriodById(reservation.periodId) }}</p>
        </div>
        <div class="lab-actions">
          <el-button type="danger" @click="cancelReservation(reservation.id)"
            >取消预约</el-button
          >
        </div>
      </el-card>
    </div>

    <!-- 实验室详细信息对话框 -->
    <el-dialog title="实验室详细信息" v-model="labDetailsDialogVisible">
      <div v-if="selectedLab">
        <p><strong>实验室名称:</strong> {{ selectedLab.name }}</p>
        <!-- <p><strong>容量:</strong> {{ selectedLab.capacity }} 人</p> -->
        <!-- <p><strong>设备:</strong> {{ selectedLab.equipment.join(', ') }}</p> -->
        <!-- <p><strong>备注:</strong> {{ selectedLab.notes }}</p> -->
      </div>
      <template #footer>
        <el-button @click="labDetailsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/axios";
import {
  WEEKS,
  DAYS,
  TIME_SLOTS,
} from "@/utils/constants";
import { useUserStore } from "@/stores/user";

const courses = ref([]); // 存储用户的课程
const labs = ref([]); // 存储所有实验室

const weeks = WEEKS;
const days = DAYS; // 星期映射为1到7

const userStore = useUserStore();

const filters = ref({
  selectedCourse: null,
  selectedWeeks: [], // 修改为数组以支持多选
  selectedDay: null,
  selectedTimeSlot: null,
});

const availableLabs = ref([]);

const labDetailsDialogVisible = ref(false);
const selectedLab = ref(null);
const showAvailableLabs = ref(false); // 控制显示可用实验室或我的预约
const showUserReservation = ref(false); // 控制显示可用实验室或我的预约

const userReservations = ref([]); // 存储用户的预约

// 获取用户的课程
const fetchCourses = async () => {
  try {
    const userId = userStore.user.id; // 假设用户ID为1，您可以根据实际情况设置
    const response = await axios.get(
      `http://127.0.0.1:8080/api/course/teacher/${userId}`
    );
    courses.value = response.data;
  } catch (error) {
    console.error("获取课程失败:", error);
  }
};

// 获取所有实验室
const fetchLabs = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8080/api/lab/list"); // 假设有一个获取所有实验室的 API
    labs.value = response.data; // 更新实验室数据
  } catch (error) {
    console.error("获取实验室失败:", error);
  }
};

// 查询可用实验室
const fetchAvailableLabs = async () => {
  if (
    filters.value.selectedCourse &&
    filters.value.selectedWeeks.length > 0 && // 检查是否选择了周数
    filters.value.selectedDay &&
    filters.value.selectedTimeSlot
  ) {
    try {
      const weekNumber = filters.value.selectedWeeks[0]; // 假设选择的周数为第一个
      const weekDay = filters.value.selectedDay; // 直接使用选中的星期
      const periodId = filters.value.selectedTimeSlot; // 直接使用选中的时段

      // 调用获取可用实验室的 API
      const response = await axios.get(
        "http://127.0.0.1:8080/api/lab/available",
        {
          params: { weekNumber, weekDay, periodId },
        }
      );

      console.log(response.data);

      availableLabs.value = response.data; // 更新可用实验室数据
      console.log(availableLabs);
      showAvailableLabs.value = !showAvailableLabs.value; // 切换视图
      showUserReservation.value = false;
    } catch (error) {
      console.error("获取可用实验室失败:", error);
      alert("获取可用实验室失败，请稍后再试");
    }
  } else {
    availableLabs.value = [];
    alert("请完整选择课程、周数、星期和时段");
  }
};

const displayCourseNameById = (courseId) => {
  const course = courses.value.find((course) => course.id === courseId);
  return course ? course.name : "未知课程";
};

const displayLabNameByid = (labId) => {
  const lab = labs.value.find((lab) => lab.id === labId);
  return lab ? lab.name : "未知实验室";
};

const getPeriodById = (periodId) => {
  const slot = TIME_SLOTS.find((slot) => slot.id === periodId);
  return slot ? slot.label : "未知时段"; // 返回对应的label或默认值
};

// 显示实验室详细信息
const showLabDetails = (lab) => {
  selectedLab.value = lab;
  labDetailsDialogVisible.value = true; // 显示实验室详情对话框
};

// 预约实验室
const bookLab = async (lab) => {
  const reservationData = {
    userId: userStore.user.id, // 假设用户ID为1
    courseId: filters.value.selectedCourse,
    labId: lab.id,
    periodId: filters.value.selectedTimeSlot,
    weekNumber: filters.value.selectedWeeks[0], // 假设选择的周数为第一个
    weekDay: filters.value.selectedDay,
  };

  try {
    const response = await axios.post(
      "http://127.0.0.1:8080/api/reservation/add",
      reservationData
    );
    console.log("预约成功:", response.data);
    alert("预约成功");
    fetchAvailableLabs();
  } catch (error) {
    console.error("预约失败:", error);
    alert("预约失败，请稍后再预约");
  }
};

// 获取用户的预约
const fetchUserReservations = async () => {
  try {
    const userId = userStore.user.id; // 获取用户ID
    const response = await axios.get(
      `http://127.0.0.1:8080/api/reservation/user/${userId}`
    );
    const filteredReservations = response.data.filter(reservation => reservation.status === 'PENDING'); // 过滤状态为PENDING的预约
    userReservations.value = filteredReservations; // 更新预约数据
    console.log(userReservations.value);

    showUserReservation.value = !showUserReservation.value; // 切换到我的预约视图
    showAvailableLabs.value = false;
  } catch (error) {
    console.error("获取用户预约失败:", error);
  }
};

// 取消预约
const cancelReservation = async (reservationId) => {
  try {
    await axios.patch(
      `http://127.0.0.1:8080/api/reservation/${reservationId}/cancel`
    ); // 调用取消预约的 API
    alert("预约已取消");
    fetchUserReservations(); // 重新获取用户预约列表
  } catch (error) {
    console.error("取消预约失败:", error);
    alert("取消预约失败，请稍后再试");
  }
};

// 组件挂载时获取用户的课程和实验室
onMounted(() => {
  fetchCourses();
  fetchLabs(); // 获取所有实验室
});
</script>

<style scoped>
.lab-booking {
  padding: 20px;
}

.available-labs {
  margin-top: 20px;
}

.user-reservations{
  margin-top: 20px;
}

.lab-card {
  margin-bottom: 15px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e4e4e4;
  border-radius: 8px;
}

.lab-content {
  flex-grow: 1;
  margin-right: 20px;
}

.lab-actions {
  display: flex;
  gap: 10px;
}

.lab-list {
  margin-top: 20px;
}
</style>
