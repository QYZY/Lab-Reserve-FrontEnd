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
          <el-checkbox
            v-for="week in weeks"
            :key="week"
            :label="week"
          >
            第 {{ week }} 周
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="选择星期">
        <el-tabs v-model="filters.selectedDay" type="card">
          <el-tab-pane
            v-for="day in days"
            :key="day"
            :label="day"
            :name="day"
          />
        </el-tabs>
      </el-form-item>

      <el-form-item label="选择时段">
        <el-tabs v-model="filters.selectedTimeSlot" type="card">
          <el-tab-pane
            v-for="timeSlot in timeSlots"
            :key="timeSlot.id"
            :label="timeSlot.label"
            :name="timeSlot.id"
          />
        </el-tabs>
      </el-form-item>

      <el-button type="primary" @click="fetchAvailableLabs">查询可用实验室</el-button>
    </el-form>

    <div class="available-labs" v-if="availableLabs.length">
      <h3>可用实验室</h3>
      <el-card
        v-for="lab in availableLabs"
        :key="lab.id"
        class="lab-card"
      >
        <div class="lab-content">
          <h4>{{ lab.name }}</h4>
          <p>容量: {{ lab.capacity }} 人</p>
          <p>设备: {{ lab.equipment.join(', ') }}</p>
        </div>
        <div class="lab-actions">
          <el-button type="text" @click="showLabDetails(lab)">查看详情</el-button>
          <el-button type="primary" @click="bookLab(lab)">预约</el-button>
        </div>
      </el-card>
    </div>

    <!-- 实验室详细信息对话框 -->
    <el-dialog title="实验室详细信息" v-model="labDetailsDialogVisible">
      <div v-if="selectedLab">
        <p><strong>实验室名称:</strong> {{ selectedLab.name }}</p>
        <p><strong>容量:</strong> {{ selectedLab.capacity }} 人</p>
        <p><strong>设备:</strong> {{ selectedLab.equipment.join(', ') }}</p>
        <p><strong>备注:</strong> {{ selectedLab.notes }}</p>
      </div>
      <template #footer>
        <el-button @click="labDetailsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const courses = ref([
  { id: 1, name: '数学实验' },
  { id: 2, name: '物理实验' },
]);

const weeks = ref([1, 2, 3, 4, 5, 6, 7, 8]);
const days = ref(['周一', '周二', '周三', '周四', '周五']);

// 自动生成时段数据
const timeSlots = ref([
  { id: '1-2', label: '一二节' },
  { id: '3-4', label: '三四节' },
  { id: '5-6', label: '五六节' },
  { id: "7-8", label: "七八节" },
]);

const filters = ref({
  selectedCourse: null,
  selectedWeeks: [], // 修改为数组以支持多选
  selectedDay: null,
  selectedTimeSlot: null,
});

const availableLabs = ref([]);
const labDetailsDialogVisible = ref(false);
const selectedLab = ref(null);

const fetchAvailableLabs = () => {
  if (
    filters.value.selectedCourse &&
    filters.value.selectedWeeks.length > 0 && // 检查是否选择了周数
    filters.value.selectedDay &&
    filters.value.selectedTimeSlot
  ) {
    // 模拟获取可用实验室数据
    availableLabs.value = [
      { id: 1, name: '实验室 A', capacity: 30, equipment: ['投影仪', '实验台'], notes: '适合大班授课' },
      { id: 2, name: '实验室 B', capacity: 25, equipment: ['计算机', '实验台'], notes: '适合小组讨论' },
    ];
  } else {
    availableLabs.value = [];
    alert('请完整选择课程、周数、星期和时段');
  }
};

const showLabDetails = (lab) => {
  selectedLab.value = lab;
  labDetailsDialogVisible.value = true; // 显示实验室详情对话框
};

const bookLab = (lab) => {
  console.log('预约实验室:', lab.name);
};
</script>

<style scoped>
.lab-booking {
  padding: 20px;
}

.available-labs {
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
</style>
