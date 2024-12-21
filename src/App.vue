<template>
  <div class="common-layout">
    <el-container class="common-container">
      <el-aside class="common-aside">
        <Aside></Aside>
      </el-aside>
      <el-container class="common-main-container">
        <el-header class="common-header">
            <Header></Header>
        </el-header>
        <el-main class="common-main">
            <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from "@/components/Aside.vue"
import Header from "@/components/Header.vue"
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  display: flex;
  height: 100%;
}

.common-layout {
  height: 100vh;
  width: 100%;
}
.common-container {
    height: 100%;
    display: flex;
}
.common-aside {
    width: 20%;

}
.common-main-container {
    width:100%;
}
.common-header {
    height: 100px
}
.commom-main {
    width: 100px;
    height:100px;
}
</style>