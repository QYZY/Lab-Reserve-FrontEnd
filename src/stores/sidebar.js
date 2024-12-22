import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    isCollapsed: false, // 初始状态为未收缩
  }),
  actions: {
    toggle() {
      this.isCollapsed = !this.isCollapsed; // 切换收缩状态
    },
  },
});
