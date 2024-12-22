import { createApp } from "vue";
import { createPinia } from "pinia";

import ElementPlus from "element-plus";
import "element-plus/dist/index.full.js";

import 'element-plus/dist/index.css'
import "@/assets/style.css"
import * as ElemnetPlusIconsVue from "@element-plus/icons-vue";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
for (const [key, component] of Object.entries(ElemnetPlusIconsVue)) {
  app.component(key, component);
}
app.use(createPinia());
app.use(ElementPlus);
app.use(router);
app.mount("#app");
