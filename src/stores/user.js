import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      id: null,
      name: "",
      role: "", // 用户角色，例如 "teacher", "lab-admin", "super-admin"
    },
    token: null,
  }),
  actions: {
    setUserInfo(user, token) {
      this.user = user; // 完全替换用户信息
      this.token = token;
      localStorage.setItem("token", token);
    },
    clearUserInfo() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
    setUserRole(role) {
      this.user.role = role;
    },
    logout() {
      this.user = { id: null, name: "", role: "" }; // 清空用户信息
      localStorage.removeItem("user"); // 移除存储信息
    },
    initializeUser() {
      // 初始化时从 localStorage 获取 Token
      const token = localStorage.getItem("token");
      if (token) {
        this.token = token;
        // 如果需要，可以在这里实现用户数据的懒加载
        // 比如向后端发送 Token 获取用户信息
      }
    },
  },
  getters: {
    isLoggedIn: (state) => state.token != null,
    isTeacher: (state) => state.user.role === "TEACHER",
    isLabAdmin: (state) => state.user.role === "LAB_ADMIN",
    isSuperAdmin: (state) => state.user.role === "SUPER_ADMIN",
  },
  persist: {
    enabled: true, // 开启持久化
    strategies: [
      {
        key: 'user', // 存储的 key
        storage: localStorage, // 存储方式
      },
    ],
  },
});
