import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      id: null,
      name: "",
      role: "", // 用户角色，例如 "teacher", "lab-admin", "super-admin"
    },
  }),
  actions: {
    setUserInfo(user) {
      this.user = user; // 完全替换用户信息
      localStorage.setItem('user', JSON.stringify(this.user)); // 同步存储到 localStorage
    },
    setUserRole(role) {
      this.user.role = role;
    },
    logout() {
      this.user = { id: null, name: '', role: '' }; // 清空用户信息
      localStorage.removeItem('user'); // 移除存储信息
    },
  },
  getters: {
    isTeacher: (state) => state.user.role === "TEACHER",
    isLabAdmin: (state) => state.user.role === "LAB_ADMIN",
    isSuperAdmin: (state) => state.user.role === "SUPER_ADMIN",
  },
});
