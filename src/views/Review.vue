<template>
  <div class="review-management">
    <h2>审核管理</h2>
    <el-table :data="pendingReviews" style="width: 100%">
      <el-table-column prop="id" label="预约ID"></el-table-column>
      <el-table-column
        prop="lab"
        label="预约实验室"
        :formatter="getLabNameById"
      ></el-table-column>
      <el-table-column
        prop="userId"
        label="提交用户"
        :formatter="getUserNameById"
      ></el-table-column>
      <el-table-column
        prop="courseId"
        label="预约课程"
        :formatter="getCourseNameById"
      ></el-table-column>
      <el-table-column prop="weekNumber" label="预约周数"></el-table-column>
      <el-table-column
        prop="weekDay"
        label="预约时间"
        :formatter="getWeekDayById"
      ></el-table-column>
      <el-table-column
        prop="periodId"
        label="预约时间段"
        :formatter="getPeriodById"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="getStatusById"
      ></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="approveReview(scope.row)"
            >通过</el-button
          >
          <el-button type="text" @click="rejectReview(scope.row)"
            >拒绝</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/axios";
import { useUserStore } from "@/stores/user";
import { DAYS, TIME_SLOTS, STATUS } from "@/utils/constants";

const pendingReviews = ref([]); // 存储待审核的预约
const labs = ref([]); // 存储所有实验室
const users = ref([]); // 存储所有用户
const courses = ref([]); // 存储所有课程
const userStore = useUserStore();

// 获取所有实验室、用户和课程
const fetchAllData = async () => {
  try {
    const labsResponse = await axios.get("http://localhost:8080/api/lab/list");
    labs.value = labsResponse.data; // 更新实验室数据

    const usersResponse = await axios.get(
      "http://localhost:8080/api/user/list"
    );
    users.value = usersResponse.data; // 更新用户数据

    const coursesResponse = await axios.get(
      "http://localhost:8080/api/course/list"
    );
    courses.value = coursesResponse.data; // 更新课程数据
  } catch (error) {
    console.error("获取数据失败:", error);
  }
};

// 获取待审核的预约
const fetchPendingReviews = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/reservation/admin/${userStore.user.id}`
    );
    pendingReviews.value = response.data; // 更新待审核的预约数据
  } catch (error) {
    console.error("获取待审核预约失败:", error);
  }
};

// 根据 ID 获取实验室名称
const getLabNameById = (labId) => {
  const lab = labs.value.find((lab) => lab.id === labId.labId);
  console.log(labId);
  // console.log( labs.value)
  return lab ? lab.name : "未知实验室";
};

// 根据 ID 获取用户名称
const getUserNameById = (userId) => {
  const user = users.value.find((user) => user.id === userId.userId);
  return user ? user.username : "未知用户";
};

// 根据 ID 获取课程名称
const getCourseNameById = (courseId) => {
  const course = courses.value.find(
    (course) => course.id === courseId.courseId
  );
  return course ? course.name : "未知课程";
};

const getWeekDayById = (weekDay) => {
  return DAYS[weekDay.weekDay - 1] || "未知星期";
};

const getPeriodById = (periodId) => {
  const slot = TIME_SLOTS.find((slot) => slot.id === periodId.periodId);
  return slot ? slot.label : "未知时段"; // 返回对应的label或默认值
};

const getStatusById = (statusId) => {
  const status = STATUS.find((status) => status.status === statusId.status);
  console.log(status);
  return status ? status.value : "未知状态";
}

const approveReview = async (review) => {
  try {
    await axios.patch(
      `http://localhost:8080/api/reservation/${review.id}/approve`
    ); // 调用通过审核的 API
    console.log("通过审核:", review.projectName);
    await fetchPendingReviews(); // 重新获取待审核的预约
  } catch (error) {
    console.error("通过审核失败:", error);
    alert("通过审核失败，请稍后再试");
  }
};

const rejectReview = async (review) => {
  try {
    await axios.patch(
      `http://localhost:8080/api/reservation/${review.id}/reject`
    ); // 调用拒绝审核的 API
    console.log("拒绝审核:", review.projectName);
    await fetchPendingReviews(); // 重新获取待审核的预约
  } catch (error) {
    console.error("拒绝审核失败:", error);
    alert("拒绝审核失败，请稍后再试");
  }
};

// 组件挂载时获取所有数据和待审核预约
onMounted(() => {
  fetchAllData(); // 获取所有实验室、用户和课程
  fetchPendingReviews(); // 获取待审核的预约
});
</script>

<style scoped>
.review-management {
  padding: 20px;
}

.el-table {
  margin-top: 20px;
}

.review-details {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #e4e4e4;
  border-radius: 5px;
  background-color: #f9f9f9;
}
</style>
