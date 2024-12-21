<template>
  <div class="header">
    <h2>实验室预约管理系统</h2>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbItems"
        :key="index"
        :to="item.path"
        @click.native="removeBreadcrumb(index)"
      >
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { ref, watch, computed  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";

const route = useRoute();
const router = useRouter();
const breadcrumbsStore = useBreadcrumbsStore();

const breadcrumbs = computed(() => breadcrumbsStore.breadcrumbs);

</script>

<style scoped>
.header {
  padding: 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.header h2 {
  margin: 0;
}

.el-breadcrumb {
  margin-top: 10px;
}
</style>