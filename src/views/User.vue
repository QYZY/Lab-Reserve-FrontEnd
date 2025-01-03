<template>
  <div class="user-management">
    <h2>用户管理</h2>
    <el-button type="primary" @click="showAddUserDialog">添加用户</el-button>

    <el-table :data="users" style="width: 100%" border>
      <el-table-column prop="id" label="用户ID" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="role" label="角色" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="editUser(scope.row)">编辑</el-button>
          <el-button type="text" @click="() => deleteUser(scope.row.id)"
            >删除</el-button
          >
          <el-button type="text" @click="resetPassword(scope.row.id)"
            >重置密码</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" v-model="addUserDialogVisible">
      <el-form :model="newUser" ref="addUserForm" :rules="addUserRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="newUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="newUser.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="newUser.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="SUPER_ADMIN" />
            <el-option label="实验室管理员" value="LAB_ADMIN" />
            <el-option label="普通教师" value="TEACHER" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddUserForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" v-model="editUserDialogVisible">
      <el-form :model="currentUser" ref="editUserForm" :rules="editUserRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currentUser.username"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="currentUser.role" placeholder="请选择角色">
            <el-option label="超级管理员" value="SUPER_ADMIN" />
            <el-option label="实验室管理员" value="LAB_ADMIN" />
            <el-option label="普通教师" value="TEACHER" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditUserForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 确认删除对话框 -->
    <el-dialog title="确认删除" v-model="deleteUserDialogVisible">
      <p>确认删除用户 {{ deleteUserTarget.username }} 吗？</p>
      <template #footer>
        <el-button @click="deleteUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDeleteUser">确定</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog title="重置密码" v-model="resetPasswordDialogVisible">
      <el-form :model="resetPasswordForm" ref="resetPasswordFormRef">
        <el-form-item label="新密码" prop="newPassword" :rules="{ required: true, message: '请输入新密码', trigger: 'blur' }">
          <el-input
            v-model="newPassword"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitResetPasswordForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/axios";

const users = ref([]); // 存储用户列表
const currentUser = ref(null); // 当前用户
const newUser = ref({ username: "", password: "", role: "" }); // 新用户数据
const addUserDialogVisible = ref(false); // 控制添加用户对话框的显示
const editUserDialogVisible = ref(false); // 控制编辑用户对话框的显示
const deleteUserDialogVisible = ref(false); // 控制确认删除对话框的显示
const deleteUserTarget = ref(null); // 待删除的用户
const resetPasswordDialogVisible = ref(false); // 控制重置密码对话框的显示
const resetPasswordForm = ref({
  newPassword: "",
  userId: "",
}); // 重置密码表单数据
const newPassword = ref("");

// 获取用户列表
const fetchUsers = async () => {
  try {
    const response = await axios.get("/user/list"); // 获取用户列表
    users.value = response.data; // 更新用户数据
  } catch (error) {
    console.error("获取用户列表失败:", error);
  }
};

const showAddUserDialog = () => {
  newUser.value = { username: "", role: "" }; // 重置新用户数据
  addUserDialogVisible.value = true; // 打开添加用户对话框
};

const submitAddUserForm = async () => {
  try {
    console.log(newUser);
    const formData = new FormData();
    Object.keys(newUser.value).forEach((key) => {
      formData.append(key, newUser.value[key]);
    });
    await axios.post("/user/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }); // 使用表单提交调用添加用户的 API
    addUserDialogVisible.value = false; // 关闭对话框
    await fetchUsers(); // 重新获取用户列表
  } catch (error) {
    console.error("添加用户失败:", error);
    alert("添加用户失败，请稍后再试");
  }
};

const editUser = (user) => {
  currentUser.value = { ...user }; // 复制用户数据到当前用户
  editUserDialogVisible.value = true; // 打开编辑用户对话框
};

const submitEditUserForm = async () => {
  try {
    const formData = new FormData();
    formData.append("userId", currentUser.value.id);
    formData.append("username", currentUser.value.username);
    formData.append("role", currentUser.value.role);
    await axios.post(`/user/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }); // 调用更新用户的 API
    editUserDialogVisible.value = false; // 关闭对话框
    await fetchUsers(); // 重新获取用户列表
    alert("用户更新成功");
  } catch (error) {
    console.error("更新用户失败:", error);
    alert("更新用户失败，请稍后再试");
  }
};

const deleteUser = async (userId) => {
  deleteUserTarget.value = users.value.find((user) => user.id === userId); // 设置待删除的用户
  deleteUserDialogVisible.value = true; // 打开确认删除对话框
};

const confirmDeleteUser = async () => {
  try {
    await axios.delete(`/user/delete/${deleteUserTarget.value.id}`); // 调用删除用户的 API
    await fetchUsers(); // 重新获取用户列表
    deleteUserDialogVisible.value = false; // 关闭对话框
  } catch (error) {
    console.error("删除用户失败:", error);
    alert("删除用户失败，请稍后再试");
  }
};

const resetPassword = async (userId) => {
  newPassword.value = "";
  resetPasswordForm.value.userId = userId;
  resetPasswordDialogVisible.value = true; // 打开重置密码对话框
  console.log(resetPasswordForm.value);
};

const submitResetPasswordForm = async () => {
  try {
    console.log(resetPasswordForm.value);
    const formData = new FormData();
    formData.append("userId", resetPasswordForm.value.userId);
    formData.append("newPassword", newPassword.value);
    await axios.post(`/user/reset`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }); // 调用重置密码的 API
    resetPasswordDialogVisible.value = false; // 关闭对话框
    alert("重置密码成功");
  } catch (error) {
    console.error("重置密码失败:", error);
    alert("重置密码失败，请稍后再试");
  }
};

// 组件挂载时获取用户列表
onMounted(() => {
  fetchUsers(); // 获取用户列表
});
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.el-table {
  margin-top: 20px;
}
</style>
