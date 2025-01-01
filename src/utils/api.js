import axios from "axios";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();


// 获取用户的课程
export const fetchCourses = async () => {
  try {
    const userId = userStore.user.id;
    const response = await axios.get(
      `http://127.0.0.1:8080/api/course/teacher/${userId}`
    );
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    console.error("获取课程失败:", error);
  }
};
