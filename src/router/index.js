import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Main from "@/views/Main.vue";
import Course from "@/views/Course.vue";
import Lab from "@/views/Lab.vue";
import User from "@/views/User.vue";
import Reserve from "@/views/Reserve.vue";
import Review from "@/views/Review.vue";
import ChangeUser from "@/components/ChangeUser.vue";
import Test from "@/components/Test.vue";

const routes = [
  // 登录页面
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "登录页面" },
  },
  // 主页面
  {
    path: "/",
    name: "Main",
    component: Main,
    meta: { requiresAuth: true, title: "主页面" },
  },
  // 课程页面
  {
    path: "/course",
    name: "Course",
    component: Course,
    meta: { requiresAuth: true, roles: ["teacher"], title: "课程管理" },
  },
  // 实验室页面
  {
    path: "/lab",
    name: "Lab",
    component: Lab,
    meta: {
      requiresAuth: true,
      roles: ["lab-admin", "super-admin"],
      title: "实验室管理",
    },
  },
  // 用户页面
  {
    path: "/user",
    name: "User",
    component: User,
    meta: { requiresAuth: true, roles: ["super-admin"], title: "用户管理" },
  },
  // 预约页面
  {
    path: "/reserve",
    name: "Reserve",
    component: Reserve,
    meta: { requiresAuth: true, roles: ["teacher"], title: "预约管理" },
  },

  // 审核页面
  {
    path: "/review",
    name: "Review",
    component: Review,
    meta: {
      requiresAuth: true,
      roles: ["lab-admin", "super-admin"],
      title: "审核管理",
    },
  },

  {
    path: "/change",
    name: "ChangeUser",
    component: ChangeUser,
    meta: { title: "用户切换" },
  },

  {
    path: "/test",
    name: "Test",
    component: Test,
    meta: { title: "测试" },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token"); // 检查是否登录
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: "Login" }); // 如果需要认证且未登录，重定向到登录页面
  } else {
    next(); // 继续导航
  }
});

export default router;
export { routes };
