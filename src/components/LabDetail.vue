<template>
    <div>
      <h1>{{ lab.name }}</h1>
      <p>{{ lab.description }}</p>
      <button @click="bookLab">预约</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        lab: {},
      };
    },
    methods: {
      async fetchLab() {
        const response = await axios.get(`/api/labs/${this.$route.params.id}`);
        this.lab = response.data;
      },
      async bookLab() {
        const user = localStorage.getItem('username'); // 假设用户名存储在 localStorage
        await axios.post(`/api/labs/${this.lab.id}/book`, null, {
          params: { user },
        });
        alert('预约成功！');
      },
    },
    mounted() {
      this.fetchLab();
    },
  };
  </script>