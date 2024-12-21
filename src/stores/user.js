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
    setUserRole(role) {
      this.user.role = role; // 设置角色
    },
    setUserInfo(userInfo) {
      this.user = { ...this.user, ...userInfo }; // 更新用户信息
    },
  },
  getters: {
    isTeacher: (state) => state.user.role === "teacher",
    isLabAdmin: (state) => state.user.role === "lab-admin",
    isSuperAdmin: (state) => state.user.role === "super-admin",
  },
});
