import { defineStore } from "pinia";

export const useBreadcrumbsStore = defineStore("breadcrumbs", {
  state: () => ({
    breadcrumbs: [],
  }),
  actions: {
    // 设置面包屑数据
    setBreadcrumbs(breadcrumbs) {
      this.breadcrumbs = breadcrumbs;
    },
    // 清空面包屑
    clearBreadcrumbs() {
      this.breadcrumbs = [];
    },
  },
});
