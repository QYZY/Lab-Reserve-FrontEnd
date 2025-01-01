<template>
  <div class="course-management">
    <h2>课程管理</h2>
    <el-button type="primary" @click="showAddCourseDialog">添加课程</el-button>

    <div class="course-cards">
      <el-card v-for="course in courses" :key="course.id" class="course-card">
        <div class="card-header">
          <h3>{{ course.name }}</h3>
          <div>
            <el-button type="text" @click.stop="showCourseDetails(course)"
              >查看详情</el-button
            >
            <el-button type="text" @click.stop="editCourse(course)"
              >编辑</el-button
            >
            <el-button type="text" @click.stop="confirmDeleteCourse(course.id)"
              >删除</el-button
            >
          </div>
        </div>
        <div class="card-content">
          <p>班级名称: {{ course.className }}</p>
          <p>授课教师: {{ getTeacherUsername(course.teacherId) }}</p>
          <p>学习时长: {{ course.studyHour }} 小时</p>
          <p>学生人数: {{ course.stuNumber }}</p>
        </div>
      </el-card>
    </div>

    <!-- 添加课程对话框 -->
    <el-dialog title="添加课程" v-model="addCourseDialogVisible">
      <el-form :model="newCourse" label-width="100px">
        <el-form-item
          label="课程名称"
          :rules="[
            { required: true, message: '请输入课程名称', trigger: 'blur' },
          ]"
        >
          <el-input v-model="newCourse.name"></el-input>
        </el-form-item>
        <el-form-item
          label="班级名称"
          :rules="[
            { required: true, message: '请输入班级名称', trigger: 'blur' },
          ]"
        >
          <el-input v-model="newCourse.className"></el-input>
        </el-form-item>
        <el-form-item
          label="学习时长"
          :rules="[
            { required: true, message: '请输入学习时长', trigger: 'blur' },
          ]"
        >
          <el-input v-model="newCourse.studyHour" type="number"></el-input>
        </el-form-item>

        <template v-if="userRole === 'SUPER_ADMIN'">
          <el-form-item
            label="授课教师"
            :rules="[
              { required: true, message: '请选择授课教师', trigger: 'change' },
            ]"
          >
            <el-select v-model="newCourse.teacherId" placeholder="请选择教师">
              <el-option
                v-for="teacher in teachers"
                :key="teacher.id"
                :label="teacher.username"
                :value="teacher.id"
              />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item
          label="学生人数"
          :rules="[
            { required: true, message: '请输入学生人数', trigger: 'blur' },
          ]"
        >
          <el-input v-model="newCourse.stuNumber" type="number"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addCourseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCourse">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑课程对话框 -->
    <el-dialog title="编辑课程" v-model="editCourseDialogVisible">
      <el-form :model="currentCourse" label-width="100px">
        <el-form-item
          label="课程名称"
          :rules="[
            { required: true, message: '请输入课程名称', trigger: 'blur' },
          ]"
        >
          <el-input v-model="currentCourse.name"></el-input>
        </el-form-item>
        <el-form-item
          label="班级名称"
          :rules="[
            { required: true, message: '请输入班级名称', trigger: 'blur' },
          ]"
        >
          <el-input v-model="currentCourse.className"></el-input>
        </el-form-item>
        <el-form-item
          label="学习时长"
          :rules="[
            { required: true, message: '请输入学习时长', trigger: 'blur' },
          ]"
        >
          <el-input v-model="currentCourse.studyHour" type="number"></el-input>
        </el-form-item>
        <el-form-item
          label="授课教师"
          :rules="[
            { required: true, message: '请选择授课教师', trigger: 'change' },
          ]"
        >
          <el-select
            v-model="currentCourse.teacherId"
            :disabled="userRole !== 'SUPER_ADMIN'"
            placeholder="请选择教师"
          >
            <el-option
              v-for="teacher in teachers"
              :key="teacher.id"
              :label="teacher.username"
              :value="teacher.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="学生人数"
          :rules="[
            { required: true, message: '请输入学生人数', trigger: 'blur' },
          ]"
        >
          <el-input v-model="currentCourse.stuNumber" type="number"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editCourseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateCourse">确定</el-button>
      </template>
    </el-dialog>

    <!-- 课程详情对话框 -->
    <el-dialog title="课程详情" v-model="courseDetailsDialogVisible">
      <div v-if="selectedCourse">
        <p><strong>课程名称:</strong> {{ selectedCourse.name }}</p>
        <p><strong>班级名称:</strong> {{ selectedCourse.className }}</p>
        <p><strong>学习时长:</strong> {{ selectedCourse.studyHour }} 小时</p>
        <p>
          <strong>授课教师:</strong>
          {{ getTeacherUsername(selectedCourse.teacherId) }}
        </p>
        <p><strong>学生人数:</strong> {{ selectedCourse.stuNumber }}</p>
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
import axios from "axios";

const userStore = useUserStore();
const courses = ref([]); // 存储课程数据
const addCourseDialogVisible = ref(false);
const editCourseDialogVisible = ref(false);
const courseDetailsDialogVisible = ref(false);
const newCourse = ref({
  name: "",
  className: "",
  studyHour: 0,
  teacherId: 0,
  stuNumber: 0,
}); // 添加课程数据
const currentCourse = ref(null); // 当前编辑的课程
const selectedCourse = ref(null);
const teacherId = ref(userStore.user.id); // 从store中获取当前用户的id
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // 设置全局 Authorization 头
}
const teachers = ref([]); // 存储教师列表
const userRole = ref(userStore.user.role); // 存储用户角色

// 获取教师列表
const fetchTeachers = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/user/teachers"); // 获取教师列表
    teachers.value = response.data; // 更新教师数据
  } catch (error) {
    console.error("获取教师列表失败:", error);
  }
};

// 获取教师用户名
const getTeacherUsername = (teacherId) => {
  const teacher = teachers.value.find((t) => t.id === teacherId);
  return teacher ? teacher.username : "未知教师"; // 返回教师用户名
};

// 显示添加课程对话框
const showAddCourseDialog = () => {
  newCourse.value = {
    name: "",
    className: "",
    studyHour: 0,
    teacherId: userStore.user.id,
    stuNumber: 0,
  }; // 重置课程信息
  addCourseDialogVisible.value = true;
};

// 添加课程
const addCourse = async () => {
  try {
    if (
      !newCourse.value.name ||
      !newCourse.value.className ||
      newCourse.value.studyHour === 0 ||
      newCourse.value.teacherId === null ||
      newCourse.value.stuNumber === 0
    ) {
      alert("请填写完整课程信息");
      return;
    }

    const courseData = {
      id: 0, // 后端生成ID，前端传0即可
      name: newCourse.value.name,
      stuNumber: newCourse.value.stuNumber,
      studyHour: newCourse.value.studyHour,
      className: newCourse.value.className,
      teacherId: newCourse.value.teacherId,
    };

    const response = await axios.post(
      "http://localhost:8080/api/course/add",
      courseData
    );
    console.log("添加课程成功:", response.data);

    // 自动刷新课程列表
    await fetchCourses(); // 刷新课程列表

    addCourseDialogVisible.value = false;
    newCourse.value = {
      name: "",
      className: "",
      studyHour: 0,
      teacherId: null,
      stuNumber: 0,
    }; // 重置课程信息
  } catch (error) {
    console.error("添加课程失败:", error);
    alert("添加课程失败，请稍后再试");
  }
};

// 显示编辑课程对话框
const editCourse = (course) => {
  currentCourse.value = { ...course }; // 复制课程数据
  editCourseDialogVisible.value = true; // 打开编辑对话框
};

// 更新课程
const updateCourse = async () => {
  try {
    const response = await axios.put(
      `http://127.0.0.1:8080/api/course/${currentCourse.value.id}`,
      currentCourse.value
    );
    console.log("更新课程成功:", response.data);

    // 自动刷新课程列表
    await fetchCourses(); // 刷新课程列表

    editCourseDialogVisible.value = false; // 关闭编辑对话框
  } catch (error) {
    console.error("更新课程失败:", error);
    alert("更新课程失败，请稍后再试");
  }
};

// 确认删除课程
const confirmDeleteCourse = (id) => {
  if (confirm("确定要删除该课程吗？")) {
    deleteCourse(id);
  }
};

// 删除课程
const deleteCourse = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:8080/api/course/${id}`);
    console.log("删除课程成功");

    // 自动刷新课程列表
    await fetchCourses(); // 刷新课程列表
  } catch (error) {
    console.error("删除课程失败:", error);
    alert("删除课程失败，请稍后再试");
  }
};

// 获取指定教师的课程数据
const fetchCourses = async () => {
  try {
    let response;
    if (userStore.user.role === "SUPER_ADMIN") {
      response = await axios.get(`http://127.0.0.1:8080/api/course/list`);
    } else {
      response = await axios.get(
        `http://127.0.0.1:8080/api/course/teacher/${teacherId.value}`
      );
    }
    courses.value = response.data;
    console.log("获取课程数据成功:", courses.value);
  } catch (error) {
    console.error("获取课程数据失败:", error);
  }
};

const showCourseDetails = (course) => {
  selectedCourse.value = course;
  courseDetailsDialogVisible.value = true;
};

// 组件挂载时获取课程数据
onMounted(() => {
  fetchCourses();
  fetchTeachers(); // 获取教师列表
});
</script>

<style scoped>
.course-management {
  padding: 20px;
}
.course-management h2 {
  margin-bottom: 20px;
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
  margin-top: 20px;
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
