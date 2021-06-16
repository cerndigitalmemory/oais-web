import { createApp } from "vue";
import Home from "./components/home.vue";

const app = createApp({
  components: {
    Home,
  },
});
app.mount("#app");
