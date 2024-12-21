<template>
    <div class="lab-list">
      <h1>实验室列表</h1>
      <div class="lab-container">
        <div class="lab-card" v-for="lab in labs" :key="lab.id">
          <h2>{{ lab.name }}</h2>
          <p>{{ lab.description }}</p>
          <button @click="bookLab(lab.id)">预约</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '../axios'; // 引入自定义的 Axios 实例
  
  export default {
    data() {
      return {
        labs: [],
      };
    },
    methods: {
      async fetchLabs() {
        const response = await axios.get('/lab/list'); // 使用相对路径
        this.labs = response.data;
      },
      async bookLab(labId) {
        await axios.post(`/labs/${labId}/book`, null); // 预约实验室
        alert('预约成功！');
      },
    },
    mounted() {
      this.fetchLabs(); // 获取实验室列表
    },
  };
  </script>
  
  <style scoped>
  .lab-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .lab-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 20px; /* 间距 */
  }
  
  .lab-card {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    width: 300px; /* 卡片宽度 */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }
  
  .lab-card:hover {
    transform: scale(1.05); /* 鼠标悬停时放大效果 */
  }
  
  .lab-card h2 {
    font-size: 1.5em;
    margin-bottom: 10px;
  }
  
  .lab-card p {
    font-size: 1em;
    color: #555;
  }
  
  .lab-card button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .lab-card button:hover {
    background-color: #0056b3; /* 鼠标悬停时按钮颜色变化 */
  }
  </style>