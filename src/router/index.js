import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Course from "@/views/Course.vue";
import Lab from "@/views/Lab.vue";
import User from "@/views/User.vue";
import Reserve from "@/views/Reserve.vue";
import Review from "@/views/Review.vue";
import Schedule from "@/views/Schedule.vue";
import ChangeUser from "@/components/ChangeUser.vue";
import Test from "@/components/Test.vue";
import Layout from "@/layouts/Main.vue";
const routes = [
  // 主页面
  {
    path: "/",
    component: Layout,
    children: [
      // 课程页面
      {
        path: "course",
        name: "Course",
        component: Course,
        meta: {
          requiresAuth: true,
          roles: ["TEACHER", "SUPER_ADMIN"],
          title: "课程管理",
          icon: "Notebook",
          hidden: false,
        },
      },
      // 实验室页面
      {
        path: "/lab",
        name: "Lab",
        component: Lab,
        meta: {
          requiresAuth: true,
          roles: ["LAB_ADMIN", "SUPER_ADMIN"],
          title: "实验室管理",
          icon: "OfficeBuilding",
          hidden: false,
        },
      },
      // 用户页面
      {
        path: "/user",
        name: "User",
        component: User,
        meta: {
          requiresAuth: true,
          roles: ["SUPER_ADMIN"],
          title: "用户管理",
          icon: "UserFilled",
          hidden: false,
        },
      },
      // 预约页面
      {
        path: "/reserve",
        name: "Reserve",
        component: Reserve,
        meta: {
          requiresAuth: true,
          roles: ["TEACHER"],
          title: "预约管理",
          icon: "Calendar",
          hidden: false,
        },
      },
      // 审核页面
      {
        path: "/review",
        name: "Review",
        component: Review,
        meta: {
          requiresAuth: true,
          roles: ["LAB_ADMIN", "SUPER_ADMIN"],
          title: "审核管理",
          icon: "Check",
          hidden: false,
        },
      },

      {
        path: "/schedule",
        name: "Schedule",
        component: Schedule,
        meta: {
          requiresAuth: true,
          roles: ["TEACHER"],
          title: "个人课表",
          icon: "User",
          hidden: false,
        },
      },

    ],
    requiresAuth: true,
  },

  // 登录页面
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "登录页面", icon: "User", hidden: false },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token"); // 检查是否登录
  if (to.path === '/login') return next();
  if ( !isLoggedIn) {
    console.log(to.meta.requiresAuth);
    next({ name: "Login" }); // 如果需要认证且未登录，重定向到登录页面
  } else {
    next(); // 继续导航
  }
});

export default router;
export { routes };
